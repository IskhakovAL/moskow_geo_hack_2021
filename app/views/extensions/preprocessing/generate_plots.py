import pandas as pd
from json import dumps, loads
from plotly.utils import PlotlyJSONEncoder
import plotly.graph_objects as go
import plotly.express as px

from ..redis_helper import RedisHelper
from ..local_config import PLOTS_ARRAY


def generate_plots(data_obj, data_zone):
    plots = []

    sum_counts = data_obj['availability_name'].value_counts().sort_index()
    sum_counts_type_zone = data_zone['zones_type'].value_counts().rename_axis('zones_type').reset_index(
        name='count')
    sum_counts_type_sport = data_zone['sport_type'].value_counts().rename_axis('sport_type').reset_index(name='count')
    fig = go.Figure()
    fig.add_trace(go.Pie(values=sum_counts, labels=sum_counts.index))
    fig.update_layout(
        title="Распределение спортивных объектов по виду доступности",
        title_x=0.5,
        margin=dict(l=0, r=0, t=30, b=0),
        legend_orientation="h")
    plots.append(loads(dumps(fig, cls=PlotlyJSONEncoder)))

    sum_counts_type_zone.loc[sum_counts_type_zone['count'] < 217, 'zones_type'] = 'Остальные типы спортзон'
    fig = px.pie(sum_counts_type_zone, values='count', names='zones_type',
                 title='Типы спортзон',
                 hover_data=['zones_type'], labels={'Тип спортзоны'})
    fig.update_traces(textposition='inside', textinfo='percent+label')
    plots.append(loads(dumps(fig, cls=PlotlyJSONEncoder)))

    sum_counts_type_sport.loc[sum_counts_type_sport['count'] < 234, 'sport_type'] = 'Остальные виды спорта'
    fig = px.pie(sum_counts_type_sport, values='count', names='sport_type',
                 title='Распределение по видам спорта',
                 hover_data=['sport_type'], labels={'Вид спорта'})
    fig.update_traces(textposition='inside', textinfo='percent+label')
    plots.append(loads(dumps(fig, cls=PlotlyJSONEncoder)))

    data = [['Городское', 7303], ['Районное', 3724], ['Окружное', 2374], ['Шаговая доступность', 436]]
    columns = ['Тип Доступности', 'Средняя площадь спортивных объектов']
    index = [1, 2, 3, 4]
    df = pd.DataFrame(data, index, columns)
    fig = px.histogram(df, x='Тип Доступности', y='Средняя площадь спортивных объектов')
    plots.append(loads(dumps(fig, cls=PlotlyJSONEncoder)))

    rh = RedisHelper()
    rh.insert(plots, PLOTS_ARRAY, False)
