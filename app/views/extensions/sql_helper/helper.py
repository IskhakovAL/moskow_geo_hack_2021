from ..local_config import SQL_ENGINE
from sqlalchemy import text


class SQLHelper:
    def __init__(self):
        self.engine = SQL_ENGINE

    def execute(self, sql_command):
        with self.engine.connect() as connection:
            result = connection.execute(text(sql_command))
        return result
