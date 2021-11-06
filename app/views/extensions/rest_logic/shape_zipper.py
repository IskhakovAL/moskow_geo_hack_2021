from os import path, listdir
from zipfile import ZipFile
from tempfile import TemporaryDirectory
from io import BytesIO
import fiona
from shapely.geometry import mapping


def zip_shape(schema, data):
    """
    Функция для создания zip архива с файлами по формату ESRI Shapefile в памяти
    :param schema: схема, по которой будет собираться shape файл
    :param data: данные, которые необходимо поместить в файл
    :return: BytesIO объект с архивом
    """
    archive = BytesIO()
    with TemporaryDirectory() as tmp_dir:
        shape_file = path.join(tmp_dir, 'result.shp')
        with fiona.open(shape_file, 'w', 'ESRI Shapefile', schema, encoding='utf-8') as c:
            c.write({
                'geometry': mapping(data.pop('geometry')),
                'properties': data
            })

        with ZipFile(archive, 'w') as zip_archive:

            for file_name in listdir(tmp_dir):
                if 'result' in file_name:
                    with zip_archive.open(file_name, 'w') as zip_file:
                        with open(path.join(tmp_dir, file_name), 'rb') as file:
                            zip_file.write(file.read())

    archive.seek(0)

    return archive
