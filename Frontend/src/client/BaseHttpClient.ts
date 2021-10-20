import queryString from 'query-string';
import noop from 'lodash/noop';
import merge from 'lodash/merge';

export class BaseHttpError extends Error {
    name = 'BaseHttpError';

    status: number;

    decodedResponse: any;

    constructor(statusText: string, status: number, decodedResponse: any) {
        super(statusText);
        this.message = `${status} ${statusText}`;
        this.status = status;
        this.decodedResponse = decodedResponse;
    }
}

const encodeUrlParams = (params) => queryString.stringify(params);

const blobContentTypes = ['application/pdf', 'application/vnd.ms-excel', 'text/plain'];

const isBlobContentType = (contentType) => {
    return blobContentTypes.some((blobContentType) => {
        return contentType.toLowerCase().includes(blobContentType);
    });
};

type TFetchResponse = {
    ok: boolean;
    status: number;
    statusText: string;
    headers: any;
    blob: () => Promise<Blob>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    text: () => Promise<string>;
};

export enum ResponseType {
    BLOB,
    ARRAY_BUFFER,
}

function handleFetchErrors([decodedResponse, response]) {
    if (!response.ok) {
        throw new BaseHttpError(response.statusText, response.status, decodedResponse);
    }
    return decodedResponse;
}

function unpackFetchResponse(responseType: ResponseType) {
    return (response: TFetchResponse) => {
        let contentType = '';

        if (response && response.headers) {
            contentType = response.headers.get('Content-Type') || '';
        }

        if (responseType === ResponseType.ARRAY_BUFFER) {
            return [response.arrayBuffer(), response];
        }
        if (responseType === ResponseType.BLOB || isBlobContentType(contentType)) {
            return [response.blob(), response];
        }

        return response.text().then((text) => {
            let decodedJson = null;

            try {
                decodedJson = JSON.parse(text);
            } catch (err) {
                return [{}, response];
            }
            return [decodedJson, response];
        });
    };
}

export interface ITransport {
    url: string;
    opts: TRequestOptions;
    responseType: ResponseType;
}
type TTransportFn = (args: ITransport) => Promise<object>;

const fetchTransport: TTransportFn = ({ url, opts, responseType }) => {
    return fetch(url, opts)
        .then(unpackFetchResponse(responseType))
        .then(handleFetchErrors);
};

export enum RequestMethod {
    GET = 'get',
    POST = 'post',
    HEAD = 'head',
    PUT = 'put',
    DELETE = 'delete',
}

export type THeaders = {
    Accept?: string;
    Authorization?: string;
    pragma?: string;
    'Cache-Control'?: string;
    'Content-Type'?: string;
};

type TData = object | FormData | string;

type TOmitDefaultErrorHandling = ((err: Error) => boolean) | boolean;

export type TOptions = {
    method?: RequestMethod;
    data?: TData;
    headers?: THeaders;
    params?: object;
    responseType?: ResponseType;
    readonly requestId?: symbol;
    omitDefaultErrorHandling?: TOmitDefaultErrorHandling;
};

type TRequestOptions = {
    method: RequestMethod;
    body: any;
    headers: THeaders;
    signal?: any;
};

interface IRequestParams {
    url: string;
    options: TOptions;
    err?: BaseHttpError;
    isOwn?: boolean;
    retryOriginRequest?: (overridenOpts: Partial<TRequestOptions>) => Promise<any>;
}

type TGlobalErrorHandler = (
    err: Error,
    omitDefaultErrorHandling: TOmitDefaultErrorHandling,
) => void;
export type TBeforeRequestFn = ({ url, options }: IRequestParams) => void;
export type TAfterRequestFn = ({ url, options, err }: IRequestParams) => Promise<any> | void;

export default class BaseHttpClient {
    protected abortControllers = {};

    protected globalErrorHandler: TGlobalErrorHandler = noop;

    protected beforeRequest: TBeforeRequestFn = noop;

    protected afterRequest: TAfterRequestFn = noop;

    protected baseUrl: string;

    protected registeredUrls = {};

    protected transport: TTransportFn = fetchTransport;

    protected registerUrl(url: string) {
        if (this.registeredUrls[url]) {
            // throw new Error( `Error: url ${url} already has been registered. Check out appropriate api call.`);
        }
        this.registeredUrls[url] = true;
    }

    registerGlobalErrorHandler(handler: TGlobalErrorHandler) {
        this.globalErrorHandler = handler;
    }

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    determineUrl(
        segmentUrl: string,
        params: object | undefined,
        isSegmentUrlRelativeToBaseUrl: boolean,
    ): string {
        return (
            (isSegmentUrlRelativeToBaseUrl ? this.baseUrl : '') +
            segmentUrl +
            (params ? `?${encodeUrlParams(params)}` : '')
        );
    }

    isApiUrlBelongsToUs = (url: string): boolean => false;

    doRequest(segmentUrl: string, options: TOptions = {}) {
        const { params, requestId, ...rest } = options;
        const isSegmentUrlRelativeToBaseUrl = !segmentUrl.startsWith('http');

        if (requestId) {
            this.abort(requestId);
            this.abortControllers[requestId] = new AbortController();
        }

        const url = this.determineUrl(segmentUrl, params, isSegmentUrlRelativeToBaseUrl);
        const isOwn = isSegmentUrlRelativeToBaseUrl || this.isApiUrlBelongsToUs(url);

        if (isOwn) {
            this.registerUrl(segmentUrl);
        }

        const opts: TRequestOptions = {
            signal: requestId && this.abortControllers[requestId].signal,
            ...this.getRequestOptions(isOwn, rest),
        };

        const request = (overridenOpts: Partial<TRequestOptions> = {}) =>
            this.transport({
                url,
                responseType: options.responseType,
                opts: merge({}, opts, overridenOpts),
            });

        this.beforeRequest({ url, options });
        return request()
            .then((response) => {
                this.afterRequest({ url, options, isOwn });

                return response;
            })
            .catch((err: BaseHttpError) => {
                if (err.name === 'AbortError') {
                    return;
                } // do not handle aborted request

                return this.afterRequest({
                    url,
                    options,
                    err,
                    isOwn,
                    retryOriginRequest: request,
                });
            });
    }

    abort(requestId) {
        const controller = this.abortControllers[requestId];

        if (controller) {
            controller.abort();
            delete this.abortControllers[requestId];
        }
    }

    omitEmptyHeaders(headers): THeaders {
        const out = {};

        Object.keys(headers).forEach((key) => {
            if (headers[key]) {
                out[key] = headers[key];
            }
        });
        return out;
    }

    protected getOwnHeaders(): THeaders {
        return {};
    }

    private getUrlEncodedFormBody(data: TData): string {
        const formBody = [];

        for (const key in data as object) {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(data[key]);

            formBody.push(`${encodedKey}=${encodedValue}`);
        }
        return formBody.join('&');
    }

    getRequestOptions(isOwnApi: boolean, options: TOptions): TRequestOptions {
        const { method = RequestMethod.GET, headers = {}, data, responseType, ...rest } = options;

        let ownHeaders = {};

        if (isOwnApi && typeof this.getOwnHeaders === 'function') {
            ownHeaders = this.getOwnHeaders();
        }

        const resultHeaders = {
            'Content-Type': 'application/json',
            Accept: [ResponseType.BLOB, ResponseType.ARRAY_BUFFER].includes(responseType)
                ? ''
                : 'application/json',
            ...ownHeaders,
            ...headers,
        };

        let body = data;

        if (typeof data === 'object') {
            const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;

            if (isFormData) {
                resultHeaders['Content-Type'] = '';
            } else if (resultHeaders['Content-Type'] === 'application/x-www-form-urlencoded') {
                body = this.getUrlEncodedFormBody(data);
            } else {
                body = JSON.stringify(data);
            }
        }

        return {
            method,
            body,
            headers: this.omitEmptyHeaders(resultHeaders),
            ...rest,
        };
    }
}
