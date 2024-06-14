
# Инструкция по запуску приложения


## Шаг 1: Клонирование репозитория

Скачайте файлы репозитория в директорию на своем устройстве

To start Metro, run the following command from the _root_ of your React Native project:

```bash
git clone https://github.com/Ocloa/PhotoGallery.git
cd PhotoGallery
```

## Шаг 2: Установка зависимостей

Установите все необходимые зависимости:

```bash
npm install --legacy-peer-deps
```

## Шаг 3: Настройка API ключа

Создайте файл ".env" в корневом каталоге проекта и добавьте в него API ключ Unsplash:

```bash
UNSPLASH_API_KEY='API KEY'
```
## Шаг 4: Запуск приложения

### Для Android
Запустите эмулятор Android-устройства и введите следующую команду в терминал:
```bash
# используя npm
npm run android

# ИЛИ используя Yarn
yarn android
```

### Для iOS
Запустите симулятор iOS-устройства и введите следующую команду 
```bash
# используя npm
npm run ios

# ИЛИ используя Yarn
yarn ios
```


