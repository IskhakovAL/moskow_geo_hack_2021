import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.utils import PlotlyJSONEncoder

from ..local_config import SQL_ENGINE

from json import loads, dumps


def generate_plots():
    """
    Функция для генерации plotly графиков с записыванием их в dict
    :return: dict с plotly графиками
    """
    plots = []

    # График 1
    sql_text = 'select * from plot1'
    data_access = pd.read_sql(sql_text, SQL_ENGINE)
    data_access = data_access.rename(columns={'availability_name': 'Вид доступности', 'count': 'Количество'})
    fig = go.Figure()
    fig.add_trace(go.Pie(values=data_access['Количество'], labels=data_access['Вид доступности']))
    fig.update_layout(
        title="Распределение спортивных объектов по виду доступности",
        title_x=0.5,
        margin=dict(l=0, r=0, t=30, b=0),
        legend_orientation="h")
    plots.append(loads(dumps(fig, cls=PlotlyJSONEncoder)))

    # График 2
    sql_text = 'select * from plot2'
    data_people = pd.read_sql(sql_text, SQL_ENGINE)
    data_people = data_people.rename(columns={'NAME_AO': 'Район', 'sum': 'Количество'})
    fig = go.Figure()
    fig.add_trace(go.Pie(values=data_people['Количество'], labels=data_people['Район']))
    fig.update_layout(
        title="Распределение численности населения по районам",
        title_x=0.5,
        margin=dict(l=0, r=0, t=30, b=0),
        legend_orientation="h")
    plots.append(loads(dumps(fig, cls=PlotlyJSONEncoder)))

    # График 3
    sql_text = 'select * from plot3'
    data_zone = pd.read_sql(sql_text, SQL_ENGINE)
    data_zone = data_zone.rename(columns={'zones_type': 'Спортивная зона', 'cnt': 'Количество'})
    fig = px.bar(data_zone, x='Спортивная зона', y = 'Количество', height=900, width=900)
    plots.append(loads(dumps(fig, cls=PlotlyJSONEncoder)))

    # График 4
    sql_text = 'select * from plot4'
    data_sport = pd.read_sql(sql_text, SQL_ENGINE)
    data_sport = data_sport.rename(columns={'sport_type': 'Вид спорта', 'cnt': 'Количество'})
    fig = px.bar(data_sport, x='Вид спорта', y = 'Количество', height=800, width=800)
    plots.append(loads(dumps(fig, cls=PlotlyJSONEncoder)))

    # График 5
    sql_text = 'select * from plot5'
    data_sport_type = pd.read_sql(sql_text, SQL_ENGINE)
    data_sport_type = data_sport_type.rename(columns={'sport_type': 'Вид спорта', 'med': 'Средняя площадь объектов'})
    fig = px.bar(data_sport_type, x='Вид спорта', y = 'Средняя площадь объектов', height=900, width=900)
    plots.append(loads(dumps(fig, cls=PlotlyJSONEncoder)))

    # График 6
    sql_text = 'select * from plot6'
    data_zones_type = pd.read_sql(sql_text, SQL_ENGINE)
    data_zones_type = data_zones_type.rename(
        columns={'zones_type': 'Тип спортивной зоны', 'med': 'Средняя площадь спортивной зоны'})
    fig = px.bar(data_zones_type, x='Тип спортивной зоны', y = 'Средняя площадь спортивной зоны', height=900, width=900)
    plots.append(loads(dumps(fig, cls=PlotlyJSONEncoder)))

    return plots
