export class FormsErrors {

    static options = {
        'error_tooltip_class': "form_error_tooltip",
        'error_tooltip_arrow_class': "form_error_tooltip_arrow",
        'error_input_class': "",
    }

    static _errorsMap = new Map()

    static createError($elem, text, placement = "bottom") {
        let $tooltip = FormsErrors._createTooltip(text, placement)
        $elem.after($tooltip)
        FormsErrors._errorsMap.set($elem[0], $tooltip)
        Popper.createPopper($elem[0], $tooltip[0], {
            placement: placement,
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 8]
                    }
                }
            ]
        },)
        $tooltip.fadeIn(500)
        FormsErrors._addInputErrorClass($elem)
    }

    static createErrors($form, errorsDict, placement = 'bottom') {
        for (const [key, value] of Object.entries(errorsDict)) {
            let $elem = $form.find(`*[name='${key}']`)
            if ($elem.length > 0) {
                $elem = $elem.last()
                FormsErrors.createError($elem, value, placement)
            }
        }
    }

    static removeError($elem) {
        let $tooltip = FormsErrors._errorsMap.get($elem[0])
        FormsErrors._destroyTooltip($tooltip)
        FormsErrors._errorsMap.delete($elem)
        FormsErrors._removeInputErrorClass($elem)
    }

    static _destroyTooltip($tooltip) {
        $tooltip.fadeOut(500, function () {
            $tooltip.remove()
        })
    }

    static removeErrors($form) {
        let tooltips = $form.find(`.${FormsErrors.options.error_tooltip_class}`)
        let inputs = tooltips.prev()
        inputs.each(function() {
            FormsErrors.removeError($(this))
        })
    }

    static removeAll() {
        FormsErrors._errorsMap.forEach(function (value, key) {
            FormsErrors._destroyTooltip(value)
        })
        FormsErrors._errorsMap.clear()
    }

    static ajaxFormPOST(url, $form, success, placement = "bottom") {
        $.ajax({
           type:"POST",
            url: url,
            cache: false,
            contentType: false,
            processData: false,
            headers:{
                "X-CSRFToken": $form.find($("[name=csrfmiddlewaretoken]").val())
            },
            data: new FormData($form[0]),
            success: success,
            error: function (jqXHR) {
               let data = $.parseJSON(jqXHR.responseText)
                FormsErrors.createErrors($form, data, placement)
            },
        });
    }

    static _createTooltip(text = "", placement='bottom') {
        let tooltip = $("<div>")
        tooltip.attr("role", "tooltip")
        tooltip.addClass(FormsErrors.options.error_tooltip_class)
        tooltip.attr('data-popper-placement', placement)
        tooltip.html(text)
        let arrow = $("<div>")
        tooltip.append(arrow)
        arrow.addClass(FormsErrors.options.error_tooltip_arrow_class)
        tooltip.hide()
        return tooltip
    }

    static _addInputErrorClass($elem) {
        if (FormsErrors.options.error_input_class !== "") {
            $elem.addClass(FormsErrors.options.error_input_class)
        }
    }

    static _removeInputErrorClass($elem) {
        if (FormsErrors.options.error_input_class !== "") {
            $elem.removeClass(FormsErrors.options.error_input_class)
        }
    }
}