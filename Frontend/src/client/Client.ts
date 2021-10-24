import noop from 'lodash/noop';
import once from 'lodash/once';
import BaseHttpClient, {
    TOptions,
    THeaders,
    BaseHttpError,
    TAfterRequestFn,
} from './BaseHttpClient';

interface IOptions extends TOptions {
    omitDefaultErrorHandling?: TOmitDefaultErrorHandling;
}

export class ClientError extends Error {
    name = 'ClientError';

    message: string;

    status: number;

    kind: string;

    datetime: string;

    // eslint-disable-next-line
    request_token: string;

    constructor(err: BaseHttpError) {
        super(err.message);
        const { status, decodedResponse } = err;

        this.status = status;
        this.kind = decodedResponse?.kind || '';
        this.datetime = decodedResponse?.datetime || '';
        this.message = decodedResponse?.message || '';
        // eslint-disable-next-line
        this.request_token = decodedResponse?.request_token || "";
    }
}

export type TOmitDefaultErrorHandling = ((err: ClientError) => boolean) | boolean;

type TGlobalErrorHandler = (
    err: ClientError,
    omitDefaultErrorHandling: TOmitDefaultErrorHandling,
) => void;

type TGetAccessToken = () => string;
type TTryToUpdateAccessToken = () => Promise<any>;

const { doRequest } = BaseHttpClient.prototype;

const MAX_UPDATE_ACCESS_TOKEN_REQUESTS = 15;

class Client extends BaseHttpClient {
    protected getAccessToken: TGetAccessToken;

    protected tryToUpdateAccessToken: TTryToUpdateAccessToken;

    protected teardown() {
        for (const key in this.abortControllers) {
            this.abort(this.abortControllers[key]);
        }
    }

    protected hasAccessToken(): boolean {
        return Boolean(this.getAccessToken());
    }

    protected updateAccessTokenCount = 0;

    protected afterRequest: TAfterRequestFn = ({
        url,
        options,
        err,
        isOwn,
        retryOriginRequest,
    }) => {
        if (err && isOwn) {
            const newClientError = new ClientError(err);

            const emitErrors = () => {
                this.globalErrorHandler(newClientError, options.omitDefaultErrorHandling);
                throw newClientError;
            };

            if (newClientError.status === 401 && this.hasAccessToken()) {
                if (++this.updateAccessTokenCount > MAX_UPDATE_ACCESS_TOKEN_REQUESTS) {
                    this.teardown();
                    emitErrors();
                    return;
                }

                return this.tryToUpdateAccessToken()
                    .catch((err) => {
                        this.teardown();
                        emitErrors();
                    })
                    .then(() => {
                        return retryOriginRequest({
                            headers: {
                                Authorization: `Bearer ${this.getAccessToken()}`,
                            },
                        }).then((response) => {
                            this.updateAccessTokenCount = 0;
                            return response;
                        });
                    });
            }
            emitErrors();
        }
    };

    constructor(
        baseUrl: string,
        getAccessToken: TGetAccessToken,
        tryToUpdateAccessToken: TTryToUpdateAccessToken,
    ) {
        super(baseUrl);
        this.getAccessToken = getAccessToken;
        this.tryToUpdateAccessToken = tryToUpdateAccessToken;
    }

    protected getOwnHeaders(): THeaders {
        return {
            Authorization: `Bearer ${this.getAccessToken()}`,
            pragma: 'no-cache',
            'Cache-Control': 'no-cache',
        };
    }

    protected globalErrorHandler: TGlobalErrorHandler = noop;

    registerGlobalErrorHandler = once((handler: TGlobalErrorHandler) => {
        this.globalErrorHandler = handler;
    });

    doRequest<T>(segmentUrl: string, options: IOptions = {}): Promise<T> {
        return doRequest.call(this, segmentUrl, options);
    }
}
const BASE_URL = 'api/';

export default new Client(
    BASE_URL,
    () => '',
    // eslint-disable-next-line compat/compat
    () => new Promise((resolve, reject) => resolve(null)),
);
