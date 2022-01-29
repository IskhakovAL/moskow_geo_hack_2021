# Карта гео-аналитики спортивных объектов Москвы
## Интерактивная карта для размещения спортивной инфраструктуры
Проект позволяет рассчитать оптимальное расположение новых спортивных обьектов, наглядно увидеть районы, в которых возможно расположить новые спортивые обьекты и площадки. Проанализировать конкретный район/участок карты, увидеть населенность района и оценить, какое потенциально количество жителей будет пользоваться тем или иным спортивным обьектом, какой из спортивных обьектов находится в пределах пешей доступности жителей данного района/области.

## [LIVE DEMO](http://23.105.226.217/) - Онлайн-демострация проекта


## Главная страница приложения
![image](https://user-images.githubusercontent.com/98597996/151672202-7477b4a9-cae6-48b1-b6fd-e3a0dc87d26f.png)



## Описание использованных технологий и алгоритмов в приложении
 Для быстрого и удобного развертывания проекта используется docker-compose. Проект поделен на 4 сервиса: nginx, backend, frontend, postgis.Каждый сервис – это отдельный docker контейнер.
 В рамках хакатона все 4 сервиса имеют свои конфигурационные файлы непосредственно в одной директории для более быстрого развертывания. В будущем все 4 сервиса можно разнести по разным серверам для более быстрой работы.
 
![image](https://user-images.githubusercontent.com/98597996/151670882-f35bb3c7-80f9-4071-9321-15e6f8258b0b.png)


### Стек технологий
* Flask (Python)
* React
* Docker
* Nginx
* PostGIS

## Полезыные ссылки
### [Презентация проекта](https://drive.google.com/file/d/1Q5YibfxzM2gRc-EpODAMlwQVZ-MZor3-/view?usp=sharing)

### [Сопроводительная документация](https://drive.google.com/file/d/1Rfv-QREsotfq8QPldo_IXB72lMVHSXn3/view?usp=sharing)

### [документация Rest API](https://documenter.getpostman.com/view/3750020/UV5ahGNC)

---

# О нас

* <dora.team@gmail.com> - По вопросам сотрудничества
* [Dora.team](https://tlgg.ru/dorateam_ofc) 
* [Искахов Аскар](https://tlgg.ru/atletiks) - Руководитель проекта
* [Молокова Мария](https://tlgg.ru/nabor_bukovok) - Дизайнер, гео-аналитик
* [Рыбкин Георгий](https://tlgg.ru/goshka_rybkin) - Бэкенд-разработчик
* [Прокудин Виктор](https://tlgg.ru/Pr0kud1n) - Фронтенд-разработчик
* [Валеев Айнур](https://tlgg.ru/aim9800) - Аналитик
* [Алексеев Егор](https://tlgg.ru/maul415) - Местный клоун
