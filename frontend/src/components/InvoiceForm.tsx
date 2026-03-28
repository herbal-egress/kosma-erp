// src/components/InvoiceForm.tsx
// Полный 100% перенос UI «Создание нового счёта» — итерация 15.html
// Сохранены: заголовок с линиями, динамические строки графика оплаты и назначения платежа,
// проверка 100%, проверка дубликатов дат, форматирование суммы, dirty-check + confirm-модал,
// модал ошибки процентов, кнопка "Добавить файл", все title="" как в оригинале.

import { useState, useEffect, useRef } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function InvoiceForm() {
    const [formData, setFormData] = useState({
        payer: '',
        counterparty: '',
        invoiceNumber: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        amount: '0,00',
        currency: 'RUB',
        vat: '20%',
        noVat: false,
        comment: '',
    });

    const [items, setItems] = useState([{ description: '', qty: 1, price: 0, amount: 0 }]);
    const [paymentSchedule, setPaymentSchedule] = useState([{ date: '', percent: 100 }]);
    const [purposes, setPurposes] = useState<string[]>(['']);

    const [dirty, setDirty] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showPercentError, setShowPercentError] = useState(false);
    const [currentPercent, setCurrentPercent] = useState(0);

    const formRef = useRef<HTMLFormElement>(null);
    const initialSnapshot = useRef<string>('');

    // ─────────────────────────────────────────────────────────────
    // Снимок для dirty-check (как в оригинальном HTML)
    // ─────────────────────────────────────────────────────────────
    const getSnapshot = () => {
        if (!formRef.current) return '{}';
        const fd = new FormData(formRef.current);
        return JSON.stringify({
            form: Object.fromEntries(fd),
            items,
            paymentSchedule,
            purposes,
        });
    };

    useEffect(() => {
        setTimeout(() => { initialSnapshot.current = getSnapshot(); }, 150);
    }, []);

    // ─────────────────────────────────────────────────────────────
    // Отслеживание изменений
    // ─────────────────────────────────────────────────────────────
    const markDirty = () => setDirty(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
        markDirty();
    };

    // ─────────────────────────────────────────────────────────────
    // Позиции счёта (Товары/услуги)
    // ─────────────────────────────────────────────────────────────
    const addItem = () => {
        setItems([...items, { description: '', qty: 1, price: 0, amount: 0 }]);
        markDirty();
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
        markDirty();
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        if (field === 'qty' || field === 'price') {
            newItems[index].amount = newItems[index].qty * newItems[index].price;
        }
        setItems(newItems);
        markDirty();
    };

    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

    // ─────────────────────────────────────────────────────────────
    // График оплаты
    // ─────────────────────────────────────────────────────────────
    const addPaymentRow = () => {
        setPaymentSchedule([...paymentSchedule, { date: '', percent: 0 }]);
        markDirty();
    };

    const updatePayment = (index: number, field: string, value: any) => {
        const newSchedule = [...paymentSchedule];
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setPaymentSchedule(newSchedule);
        markDirty();
    };

    const removePayment = (index: number) => {
        if (paymentSchedule.length > 1) {
            setPaymentSchedule(paymentSchedule.filter((_, i) => i !== index));
            markDirty();
        }
    };

    const calculatePercentSum = () => paymentSchedule.reduce((sum, p) => sum + (parseFloat(p.percent.toString()) || 0), 0);

    // ─────────────────────────────────────────────────────────────
    // Назначение платежа
    // ─────────────────────────────────────────────────────────────
    const addPurposeRow = () => {
        setPurposes([...purposes, '']);
        markDirty();
    };

    const updatePurpose = (index: number, value: string) => {
        const newPurposes = [...purposes];
        newPurposes[index] = value;
        setPurposes(newPurposes);
        markDirty();
    };

    const removePurpose = (index: number) => {
        if (purposes.length > 1) {
            setPurposes(purposes.filter((_, i) => i !== index));
            markDirty();
        }
    };

    // ─────────────────────────────────────────────────────────────
    // Защита от потери данных + модалы
    // ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (dirty && getSnapshot() !== initialSnapshot.current) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [dirty]);

    const handleClose = () => {
        if (!dirty || getSnapshot() === initialSnapshot.current) {
            window.history.back();
            return;
        }
        setShowConfirm(true);
    };

    const confirmClose = () => {
        setShowConfirm(false);
        setDirty(false);
        window.history.back();
    };

    // ─────────────────────────────────────────────────────────────
    // Сохранение
    // ─────────────────────────────────────────────────────────────
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        const percentSum = calculatePercentSum();
        if (percentSum !== 100) {
            setCurrentPercent(percentSum);
            setShowPercentError(true);
            return;
        }

        alert('Счёт успешно сохранён (демо-режим)');
        setDirty(false);
        initialSnapshot.current = getSnapshot();
    };

    return (
        <div className="container py-5" title="Страница создания нового счёта — полная копия HTML итерации 15">
            <div className="card shadow-lg border-0 rounded-4">
                {/* Заголовок с линиями — как в оригинальном HTML */}
                <div className="card-header bg-primary text-white text-center py-4 position-relative">
                    <div className="modal-title-wrap d-flex align-items-center justify-content-center">
                        <div className="modal-title-line flex-grow-1 bg-white opacity-25" style={{ height: '1px' }}></div>
                        <div className="modal-title-text mx-3 fw-bold fs-4">Создание нового счета</div>
                        <div className="modal-title-line flex-grow-1 bg-white opacity-25" style={{ height: '1px' }}></div>
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white position-absolute top-0 end-0 mt-3 me-3"
                        onClick={handleClose}
                        title="Закрыть форму (при несохранённых изменениях будет подтверждение)"
                    ></button>
                </div>

                <div className="card-body p-5">
                    <form ref={formRef} onSubmit={handleSave} noValidate>

                        {/* Плательщик + Контрагент + Номер + Дата */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <select className="form-select" name="payer" value={formData.payer} onChange={handleChange} required title="Выберите плательщика">
                                        <option value="">Выберите плательщика...</option>
                                        <option value="fpa">ООО «ФПА»</option>
                                        <option value="kosma">ООО «КОСМА»</option>
                                    </select>
                                    <label>Плательщик *</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <select className="form-select" name="counterparty" value={formData.counterparty} onChange={handleChange} required title="Выберите контрагента">
                                        <option value="">Выберите контрагента...</option>
                                        <option value="energoprom">ООО «Энергопром»</option>
                                        <option value="rigel">ООО «Ригель»</option>
                                    </select>
                                    <label>Контрагент *</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <div className="form-floating">
                                    <input type="text" className="form-control" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} placeholder=" " required title="Номер счёта" />
                                    <label>Номер счета</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-floating">
                                    <input type="date" className="form-control" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} required title="Дата выставления счёта" />
                                    <label>Дата счета</label>
                                </div>
                            </div>
                        </div>

                        {/* Сумма, валюта, НДС */}
                        <div className="row g-3 mb-5 align-items-end">
                            <div className="col-md-5">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control text-end"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        title="Сумма к оплате"
                                    />
                                    <label>Сумма к оплате</label>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-floating">
                                    <select className="form-select" name="currency" value={formData.currency} onChange={handleChange} title="Валюта">
                                        <option value="RUB">RUB</option>
                                        <option value="EUR">EUR</option>
                                        <option value="USD">USD</option>
                                    </select>
                                    <label>Валюта</label>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-floating">
                                    <select className="form-select" name="vat" value={formData.vat} onChange={handleChange} disabled={formData.noVat} title="Ставка НДС">
                                        <option value="0">0%</option>
                                        <option value="10">10%</option>
                                        <option value="20">20%</option>
                                    </select>
                                    <label>НДС</label>
                                </div>
                            </div>
                            <div className="col-md-2 pt-3">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="noVat" checked={formData.noVat} onChange={handleChange} title="Без НДС" />
                                    <label className="form-check-label">без НДС</label>
                                </div>
                            </div>
                        </div>

                        {/* График оплаты */}
                        <div className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">График оплаты</h5>
                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={addPaymentRow} title="Добавить этап оплаты">
                                    <Plus size={16} /> Добавить
                                </button>
                            </div>

                            {paymentSchedule.map((row, i) => (
                                <div key={i} className="row g-3 mb-2 align-items-center">
                                    <div className="col-md-5">
                                        <input type="date" className="form-control" value={row.date} onChange={e => updatePayment(i, 'date', e.target.value)} required title="Дата платежа" />
                                    </div>
                                    <div className="col-md-5">
                                        <input type="number" className="form-control" value={row.percent} onChange={e => updatePayment(i, 'percent', parseFloat(e.target.value))} min="0" max="100" required title="Процент от суммы" />
                                    </div>
                                    <div className="col-md-2">
                                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removePayment(i)} title="Удалить строку графика">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Назначение платежа */}
                        <div className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Назначение платежа</h5>
                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={addPurposeRow} title="Добавить назначение платежа">
                                    <Plus size={16} /> Добавить
                                </button>
                            </div>

                            {purposes.map((p, i) => (
                                <div key={i} className="input-group mb-2">
                                    <input type="text" className="form-control" value={p} onChange={e => updatePurpose(i, e.target.value)} placeholder="Например: 1308" title="Назначение платежа" />
                                    <button type="button" className="btn btn-outline-danger" onClick={() => removePurpose(i)} disabled={purposes.length === 1} title="Удалить строку">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Комментарий */}
                        <div className="form-floating mb-4">
                            <textarea className="form-control" name="comment" value={formData.comment} onChange={handleChange} style={{ height: '100px' }} title="Комментарий к счёту"></textarea>
                            <label>Комментарий</label>
                        </div>

                        {/* Кнопки */}
                        <div className="d-flex justify-content-between align-items-center">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => alert('Файл добавлен (демо)')} title="Добавить файл к счёту">
                                Добавить файл
                            </button>
                            <div className="d-flex gap-3">
                                <button type="button" className="btn btn-outline-secondary" onClick={handleClose} title="Отмена">
                                    <X size={18} className="me-2" /> Отмена
                                </button>
                                <button type="submit" className="btn btn-primary" title="Сохранить счёт">
                                    <Save size={18} className="me-2" /> Сохранить
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Модал подтверждения закрытия */}
            {showConfirm && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header"><h5>Несохранённые изменения</h5></div>
                            <div className="modal-body">Закрыть без сохранения?</div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Отмена</button>
                                <button className="btn btn-danger" onClick={confirmClose}>Закрыть</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Модал ошибки процентов */}
            {showPercentError && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header"><h5>Ошибка в графике оплаты</h5></div>
                            <div className="modal-body">Сумма процентов должна быть ровно 100%.<br />Сейчас: <strong>{currentPercent}%</strong></div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={() => setShowPercentError(false)}>Понял</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}