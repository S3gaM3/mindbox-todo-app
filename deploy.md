# Инструкция по деплою на GitHub Pages

## Шаги для деплоя:

1. **Создайте репозиторий на GitHub** с именем `mindbox-todo-app`

2. **Обновите homepage в package.json**:
   Замените `https://yourusername.github.io/mindbox-todo-app` на ваш реальный URL

3. **Инициализируйте Git и загрузите код**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/mindbox-todo-app.git
   git push -u origin main
   ```

4. **Запустите деплой**:
   ```bash
   npm run deploy
   ```

5. **Настройте GitHub Pages**:
   - Перейдите в Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

## Примечание:
После деплоя приложение будет доступно по адресу:
`https://yourusername.github.io/mindbox-todo-app`
