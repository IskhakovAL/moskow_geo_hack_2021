from ..local_config import SQL_ENGINE
from sqlalchemy import text


class SQLHelper:
    """
    Класс для более удобной работой с выполнения SQL запросов к базе данных PSQL
    """
    def __init__(self):
        """
        Получаем подключение к базе данных из конфига
        """
        self.engine = SQL_ENGINE

    def execute(self, sql_command):
        """
        Метод для выполнения SQL запроса в базе данных с возвратом полученного результата
        :param sql_command: string с SQL командой
        :return: результат выполнения SQL запроса
        """
        with self.engine.connect() as connection:
            result = connection.execute(text(sql_command))
        return result
