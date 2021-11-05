from os import path, listdir
from zipfile import ZipFile
from tempfile import TemporaryDirectory
from io import BytesIO


def zip_shape(df):
    archive = BytesIO()
    with TemporaryDirectory() as tmp_dir:
        shape_file = path.join(tmp_dir, 'result.shp')
        df.to_file(shape_file, driver='ESRI Shapefile')

        with ZipFile(archive, 'w') as zip_archive:

            for file_name in listdir(tmp_dir):
                if 'result' in file_name:
                    with zip_archive.open(file_name, 'w') as zip_file:
                        with open(path.join(tmp_dir, file_name), 'rb') as file:
                            zip_file.write(file.read())

    archive.seek(0)

    return archive
