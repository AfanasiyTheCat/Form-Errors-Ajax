## Ошибки форм
Позволяет показывать подсказки для форм при ошибке валидации
- необходим Popper.js
### Сервер
В качестве ответа при ошибке должна возвращается JSON строка
где:
- Ключ: атрибут name инпута который вызвал ошибку
- Значение: описание ошибки которую увидит пользователь

Например, при отправке формы
```html
<form>
    <input type="text" name="username">
    <input type="password" name="password">
</form>
```
ответ должен быть формата
```json
{
  'username': "Имя пользователя не должно содержать спец.символы",
  'password': "Пароль неверный"
}
```
**Django Forms** составляет такой словарь автоматически при вызове поля **errors**

### Клиент
Может использовать встроенный метод POST запроса 
```js
FormsErrors.ajaxFormPOST(URL, $FORM, function () {
        ...success...
    }, placement = "bottom")
```
или использовать метод, принимающий словарь описанный выше
```js
FormsErrors.createErrors($FORM, ERRORS_DICT, placement = "bottom")
```
_placement_ отвечает за расположение подсказки относительно инпута

## Методы
- createError($elem, text, placement = "bottom") - создает подсказку ошибки и 
добавляет _error_input_class_ к инпуту (см. ниже)
  
- createErrors($form, errorsDict, placement = "bottom") - создает подсказки
внутри формы на основе словаря (name - error_text)
  
- removeError($elem) - удаляет подсказку и класс _error_input_class_

- removeErrors($form) - удаляет подсказки внутри формы

- removeAll() - удаляет все подсказки со страницы

- ajaxFormPOST(url, $form, success_func, placement = "bottom") - 
POST запрос с данными формы $form, при ошибки вызывается _createErrors_

## Настройка
происходит при помощи словаря **FormsErrors.options**
- error_tooltip_class: CSS класс подсказки
- error_tooltip_arrow_class: CSS класс стрелочки подсказки
- error_input_class: CSS класс для инпута, за которым закреплена ошибка
  (по умолчанию опция пустая)
