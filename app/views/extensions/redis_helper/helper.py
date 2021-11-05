from msgpack import packb, unpackb
import pandas as pd
from ..local_config import REDIS_CONNECTION


class RedisHelper:
    def __init__(self):
        self.rd = REDIS_CONNECTION

    def insert(self, data, name, dataframe=True):
        if dataframe:
            data = data.to_dict('records')
        self.rd.set(str(name), packb(data))

    def get(self, name, dataframe=True):
        try:
            packed_data_dict = self.rd.get(str(name))
            data_dict = unpackb(packed_data_dict)
            if dataframe:
                return pd.DataFrame(data_dict)
            else:
                return data_dict
        except Exception as e:
            return None

    def remove(self, name):
        self.rd.delete(str(name))

    def rewrite(self, df, name, dataframe=True):
        self.remove(name)
        self.insert(df, name, dataframe)
