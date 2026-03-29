import { useEffect, useMemo, useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { validateInvoiceForm } from '../utils/validation';

type InvoiceItem = {
    description: string;
    quantity: number;
    price: number;
    amount: number;
};

type PaymentStage = {
    date: string;
    percent: number;
};

type InvoiceFormData = {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    payer: string;
    items: InvoiceItem[];
    paymentSchedule: PaymentStage[];
};

const createEmptyItem = (): InvoiceItem => ({
    description: '',
    quantity: 1,
    price: 0,
    amount: 0
});

const createEmptyPaymentStage = (): PaymentStage => ({
    date: '',
    percent: 0
});

export default function InvoiceForm() {
    const [formData, setFormData] = useState<InvoiceFormData>({
        invoiceNumber: '',
        issueDate: '',
        dueDate: '',
        payer: '',
        items: [createEmptyItem()],
        paymentSchedule: [{ date: '', percent: 100 }]
    });

    const [dirty, setDirty] = useState(false);
    const [validationError, setValidationError] = useState<string>('');

    // Предупреждение при закрытии вкладки с несохранёнными изменениями.
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!dirty) {
                return;
            }
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dirty]);

    const total = useMemo(() => {
        return formData.items.reduce((sum, item) => sum + item.amount, 0);
    }, [formData.items]);

    const addItem = () => {
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, createEmptyItem()]
        }));
        setDirty(true);
    };

    const removeItem = (index: number) => {
        setFormData((prev) => {
            const nextItems = prev.items.filter((_, itemIndex) => itemIndex !== index);
            return {
                ...prev,
                items: nextItems.length > 0 ? nextItems : [createEmptyItem()]
            };
        });
        setDirty(true);
    };

    // Универсальное обновление поля позиции счёта без использования any.
    const updateItem = <K extends keyof InvoiceItem>(index: number, field: K, value: InvoiceItem[K]) => {
        setFormData((prev) => {
            const nextItems = [...prev.items];
            const updated = { ...nextItems[index], [field]: value } as InvoiceItem;

            if (field === 'quantity' || field === 'price') {
                updated.amount = Number(updated.quantity) * Number(updated.price);
            }

            nextItems[index] = updated;
            return {
                ...prev,
                items: nextItems
            };
        });
        setDirty(true);
    };

    const addPayment = () => {
        setFormData((prev) => ({
            ...prev,
            paymentSchedule: [...prev.paymentSchedule, createEmptyPaymentStage()]
        }));
        setDirty(true);
    };

    const updatePayment = <K extends keyof PaymentStage>(index: number, field: K, value: PaymentStage[K]) => {
        setFormData((prev) => {
            const nextPayment = [...prev.paymentSchedule];
            nextPayment[index] = {
                ...nextPayment[index],
                [field]: value
            };
            return {
                ...prev,
                paymentSchedule: nextPayment
            };
        });
        setDirty(true);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors = validateInvoiceForm({
            invoiceNumber: formData.invoiceNumber,
            issueDate: formData.issueDate,
            dueDate: formData.dueDate,
            payer: formData.payer,
            items: formData.items.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                price: item.price
            })),
            paymentSchedule: formData.paymentSchedule.map((stage) => ({
                date: stage.date,
                percent: stage.percent
            }))
        });

        if (Object.keys(errors).length > 0) {
            setValidationError(Object.values(errors)[0]);
            return;
        }

        setValidationError('');
        alert('Счёт сохранён (демо-режим)');
        setDirty(false);
    };

    return (
        <div className="container py-5" title="Форма создания нового счёта">
            <div className="card shadow-lg border-0 rounded-4" title="Карточка формы счёта">
                <div className="card-header bg-primary text-white text-center py-4" title="Заголовок формы счёта">
                    <h2 className="mb-0" title="Название формы">Создание нового счёта</h2>
                </div>

                <div className="card-body p-5" title="Основное содержимое формы">
                    <form onSubmit={handleSubmit} onChange={() => setDirty(true)} title="Форма ввода данных счёта">
                        <div className="row g-4 mb-5" title="Блок основных реквизитов счёта">
                            <div className="col-md-4" title="Поле номера счёта">
                                <label className="form-label fw-bold" title="Подпись поля номера счёта">Номер счёта</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.invoiceNumber}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, invoiceNumber: event.target.value }))}
                                    required
                                    title="Введите номер счёта"
                                />
                            </div>

                            <div className="col-md-4" title="Поле даты выставления">
                                <label className="form-label fw-bold" title="Подпись даты выставления">Дата выставления</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.issueDate}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, issueDate: event.target.value }))}
                                    required
                                    title="Выберите дату выставления счёта"
                                />
                            </div>

                            <div className="col-md-4" title="Поле срока оплаты">
                                <label className="form-label fw-bold" title="Подпись срока оплаты">Срок оплаты</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.dueDate}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, dueDate: event.target.value }))}
                                    required
                                    title="Выберите конечную дату оплаты"
                                />
                            </div>
                        </div>

                        <div className="mb-5" title="Блок выбора плательщика">
                            <label className="form-label fw-bold" title="Подпись поля выбора плательщика">Плательщик</label>
                            <select
                                className="form-select"
                                value={formData.payer}
                                onChange={(event) => setFormData((prev) => ({ ...prev, payer: event.target.value }))}
                                required
                                title="Выберите плательщика из списка"
                            >
                                <option value="" title="Пустой вариант">Выберите плательщика...</option>
                                <option value="1" title="Демонстрационный плательщик ООО Ромашка">ООО «Ромашка»</option>
                                <option value="2" title="Демонстрационный плательщик ИП Иванов">ИП Иванов</option>
                            </select>
                        </div>

                        <div className="mb-5" title="Блок позиций счёта">
                            <div className="d-flex justify-content-between align-items-center mb-3" title="Заголовок раздела позиций счёта">
                                <h5 className="mb-0" title="Название раздела">Позиции счёта</h5>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    onClick={addItem}
                                    title="Добавить новую позицию товара или услуги"
                                >
                                    <Plus size={16} /> Добавить позицию
                                </button>
                            </div>

                            {formData.items.map((item, index) => (
                                <div key={`item-${index}`} className="row g-3 mb-3 align-items-end border-bottom pb-3" title={`Строка позиции счёта №${index + 1}`}>
                                    <div className="col-md-5" title="Поле наименования позиции">
                                        <label className="form-label" title="Подпись поля наименования">Наименование</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.description}
                                            onChange={(event) => updateItem(index, 'description', event.target.value)}
                                            required
                                            title="Введите описание товара или услуги"
                                        />
                                    </div>

                                    <div className="col-md-2" title="Поле количества">
                                        <label className="form-label" title="Подпись поля количества">Кол-во</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min={1}
                                            value={item.quantity}
                                            onChange={(event) => updateItem(index, 'quantity', Number(event.target.value))}
                                            required
                                            title="Введите количество единиц"
                                        />
                                    </div>

                                    <div className="col-md-2" title="Поле цены">
                                        <label className="form-label" title="Подпись поля цены">Цена</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            step="0.01"
                                            min={0}
                                            value={item.price}
                                            onChange={(event) => updateItem(index, 'price', Number(event.target.value))}
                                            required
                                            title="Введите цену за единицу"
                                        />
                                    </div>

                                    <div className="col-md-2" title="Поле суммы по позиции">
                                        <label className="form-label" title="Подпись рассчитанной суммы">Сумма</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={item.amount.toFixed(2)}
                                            readOnly
                                            title="Автоматически рассчитанная сумма по позиции"
                                        />
                                    </div>

                                    <div className="col-md-1 d-flex justify-content-end" title="Кнопка удаления позиции">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => removeItem(index)}
                                            title="Удалить текущую позицию"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="text-end mt-3" title="Итоговая сумма счёта">
                                <h5 title="Рассчитанный итог по всем позициям">Итого: {total.toFixed(2)} ₽</h5>
                            </div>
                        </div>

                        <div className="mb-5" title="Блок графика оплаты">
                            <div className="d-flex justify-content-between align-items-center mb-3" title="Заголовок раздела графика оплаты">
                                <h5 className="mb-0" title="Название раздела">График оплаты</h5>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={addPayment}
                                    title="Добавить этап оплаты"
                                >
                                    Добавить этап
                                </button>
                            </div>

                            {formData.paymentSchedule.map((stage, index) => (
                                <div key={`payment-${index}`} className="row g-3 mb-3" title={`Строка этапа оплаты №${index + 1}`}>
                                    <div className="col-md-6" title="Поле даты платежа">
                                        <label className="form-label" title="Подпись даты платежа">Дата платежа</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={stage.date}
                                            onChange={(event) => updatePayment(index, 'date', event.target.value)}
                                            required
                                            title="Выберите дату платежа"
                                        />
                                    </div>

                                    <div className="col-md-6" title="Поле процента платежа">
                                        <label className="form-label" title="Подпись процента платежа">% от суммы</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min={0}
                                            max={100}
                                            value={stage.percent}
                                            onChange={(event) => updatePayment(index, 'percent', Number(event.target.value))}
                                            required
                                            title="Введите процент от общей суммы"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex gap-3 justify-content-end mt-5" title="Панель действий формы">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => window.history.back()}
                                title="Отменить создание счёта и вернуться назад"
                            >
                                <X size={18} className="me-2" /> Отмена
                            </button>
                            <button type="submit" className="btn btn-primary" title="Сохранить счёт в системе (демо)">
                                <Save size={18} className="me-2" /> Сохранить счёт
                            </button>
                        </div>
                        {validationError && (
                            <div className="alert alert-danger mt-3" title="Сообщение об ошибке валидации">
                                {validationError}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}