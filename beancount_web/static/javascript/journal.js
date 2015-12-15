// http://stackoverflow.com/a/16315366
Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

Handlebars.registerHelper('format_currency', function(number) {
    if (isNumber(number)) return formatCurrency(number);
});

Handlebars.registerHelper('context_url', function(hash) {
    return window.contextURL.replace("_REPLACE_ME_", hash);
});

Handlebars.registerHelper('account_url', function(accountName) {
    return window.accountURL.replace("_REPLACE_ME_", accountName);
});

Handlebars.registerHelper('document_url', function(documentPath) {
    return window.documentURL.replace("_REPLACE_ME_", htmlEncode(documentPath));
});

Handlebars.registerHelper('ifShowChangeAndBalance', function(unused, options) {
    return window.journalShowChangeAndBalance ? options.fn(this) : options.inverse(this);
});

$(document).ready(function() {
    if (window.journalAsJSON != undefined) {
        var source   = $("#journal-template").html();
        var template = Handlebars.compile(source);
        var html    = template({ journal: window.journalAsJSON });
        $('.journal-table').html(html);

        // Toggle positions with checkboxes
        $('.table-filter input[type="checkbox"]').change(function() {
            var $this = $(this);
            var type = $this.attr('data-type');
            var shouldHide = $this.prop('checked');
            $('table.journal-table tr[data-type="' + type + '"]').toggle(shouldHide);
            $('table.journal-table tr[data-parent-type="' + type + '"]').toggle(shouldHide).toggleClass('hidden', !shouldHide);
        });
        $('.table-filter input[type="checkbox"]').each(function() { $(this).trigger('change'); });

        // Toggle legs by clicking on transaction/padding row
        $('table.journal-table tr[data-has-legs="True"]').click(function() {
            var hash = $(this).attr('data-hash');
            $('table.journal-table tr[data-parent-hash="' + hash + '"]').toggle(); // .toggleClass('hidden', shouldHide);
        });

        // Button "Hide/Show legs"
        $('input#toggle-legs').click(function(event) {
            event.preventDefault();
            var shouldHide = true;  // $(this).hasClass('hide-legs');
            $('table.journal-table tr[data-type="leg"]:not(.hidden)').toggle(!shouldHide).toggleClass('hidden', shouldHide);
            // $(this).toggleClass('hide-legs');
            // $(this).val(shouldHide ? 'Hide legs' : 'Show legs');
        });
    }
});
