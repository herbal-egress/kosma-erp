// Единый слой валидации форм UI-демо.
// Здесь собраны переиспользуемые проверки для разных форм.

export type ValidationErrors = Record<string, string>;

const innRegex = /^(\d{10}|\d{12})$/;
const kppRegex = /^\d{9}$/;
const ogrnRegex = /^(\d{13}|\d{15})$/;
const bikRegex = /^\d{9}$/;

export const isBlank = (value: string): boolean => value.trim().length === 0;

export function validatePayerForm(data: {
    shortName: string;
    fullName: string;
    director: string;
    legalAddress: string;
    inn: string;
    kpp: string;
    ogrn: string;
    bik: string;
    website: string;
}): ValidationErrors {
    const errors: ValidationErrors = {};

    if (isBlank(data.shortName)) errors.shortName = 'Сокращённое наименование обязательно.';
    if (isBlank(data.fullName)) errors.fullName = 'Полное наименование обязательно.';
    if (isBlank(data.director)) errors.director = 'Руководитель обязателен.';
    if (isBlank(data.legalAddress)) errors.legalAddress = 'Юридический адрес обязателен.';
    if (!innRegex.test(data.inn)) errors.inn = 'ИНН должен содержать 10 или 12 цифр.';
    if (!isBlank(data.kpp) && !kppRegex.test(data.kpp)) errors.kpp = 'КПП должен содержать 9 цифр.';
    if (!isBlank(data.ogrn) && !ogrnRegex.test(data.ogrn)) errors.ogrn = 'ОГРН/ОГРНИП должен содержать 13 или 15 цифр.';
    if (!isBlank(data.bik) && !bikRegex.test(data.bik)) errors.bik = 'БИК должен содержать 9 цифр.';
    if (!isBlank(data.website) && !/^https?:\/\/.+/i.test(data.website)) errors.website = 'Сайт должен начинаться с http:// или https://';

    return errors;
}

export function validateCounterpartyForm(data: {
    name: string;
    inn: string;
    kpp: string;
    ogrn: string;
    email: string;
    website: string;
    goodsGroups: string[];
}): ValidationErrors {
    const errors: ValidationErrors = {};

    if (isBlank(data.name)) errors.name = 'Наименование обязательно.';
    if (!innRegex.test(data.inn)) errors.inn = 'ИНН должен содержать 10 или 12 цифр.';
    if (!isBlank(data.kpp) && !kppRegex.test(data.kpp)) errors.kpp = 'КПП должен содержать 9 цифр.';
    if (!isBlank(data.ogrn) && !ogrnRegex.test(data.ogrn)) errors.ogrn = 'ОГРН/ОГРНИП должен содержать 13 или 15 цифр.';
    if (!isBlank(data.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Введите корректный e-mail.';
    if (!isBlank(data.website) && !/^https?:\/\/.+/i.test(data.website)) errors.website = 'Сайт должен начинаться с http:// или https://';
    if (data.goodsGroups.every((group) => isBlank(group))) errors.goodsGroups = 'Добавьте хотя бы одну группу товаров/услуг.';

    return errors;
}

export function validateInvoiceForm(data: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    payer: string;
    items: Array<{ description: string; quantity: number; price: number }>;
    paymentSchedule: Array<{ date: string; percent: number }>;
}): ValidationErrors {
    const errors: ValidationErrors = {};

    if (isBlank(data.invoiceNumber)) errors.invoiceNumber = 'Номер счёта обязателен.';
    if (isBlank(data.issueDate)) errors.issueDate = 'Дата выставления обязательна.';
    if (isBlank(data.dueDate)) errors.dueDate = 'Срок оплаты обязателен.';
    if (isBlank(data.payer)) errors.payer = 'Выберите плательщика.';

    if (data.items.length === 0) {
        errors.items = 'Добавьте хотя бы одну позицию.';
    } else {
        const invalidItem = data.items.find((item) => isBlank(item.description) || item.quantity <= 0 || item.price < 0);
        if (invalidItem) errors.items = 'Проверьте описание, количество и цену в позициях счёта.';
    }

    if (data.paymentSchedule.length === 0) {
        errors.paymentSchedule = 'Добавьте хотя бы один этап оплаты.';
    } else {
        const totalPercent = data.paymentSchedule.reduce((sum, stage) => sum + Number(stage.percent), 0);
        const invalidStage = data.paymentSchedule.find((stage) => isBlank(stage.date) || stage.percent < 0 || stage.percent > 100);
        if (invalidStage) errors.paymentSchedule = 'Проверьте даты и проценты в графике оплаты.';
        if (Math.round(totalPercent * 100) / 100 !== 100) errors.paymentScheduleTotal = 'Сумма процентов графика оплаты должна быть 100%.';
    }

    return errors;
}