// frontend/src/components/InvoiceForm.tsx
import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css'; // если ещё не импортировано глобально

export default function InvoiceForm() {
    const [formData, setFormData] = useState({
        invoiceNumber: '',
        issueDate: '',
        dueDate: '',
        payer: '',
        items: [{ description: '', quantity: 1, price: 0, amount: 0 }],
        total: 0,
        paymentSchedule: [{ date: '', percent: 100 }],
    });

    const [dirty, setDirty] = useState(false);

    // Простая защита от потери изменений (как в вашем HTML)
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (dirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [dirty]);

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, price: 0, amount: 0 }],
        }));
        setDirty(true);
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
        setDirty(true);
    };

    const updateItem = (index: number, field: string, value: any) => {
        setFormData(prev => {
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            if (field === 'quantity' || field === 'price') {
                newItems[index].amount = newItems[index].quantity * newItems[index].price;
            }
            return { ...prev, items: newItems };
        });
        setDirty(true);
    };

    const addPayment = () => {
        setFormData(prev => ({
            ...prev,
            paymentSchedule: [...prev.paymentSchedule, { date: '', percent: 0 }],
        }));
        setDirty(true);
    };

    const updatePayment = (index: number, field: string, value: any) => {
        setFormData(prev => {
            const newSchedule = [...prev.paymentSchedule];
            newSchedule[index] = { ...newSchedule[index], [field]: value };
            return { ...prev, paymentSchedule: newSchedule };
        });
        setDirty(true);
    };

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + item.amount, 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Здесь будет вызов API /api/invoices в будущем
        alert('Счёт сохранён (демо-режим)');
        setDirty(false);
    };

    return (
        <div className="container py-5">
            <div className="card shadow-lg border-0 rounded-4">
                <div className="card-header bg-primary text-white text-center py-4">
                    <h2 className="mb-0">Создание нового счёта</h2>
                </div>

                <div className="card-body p-5">
                    <form onSubmit={handleSubmit} onChange={() => setDirty(true)}>
                        {/* Основные поля */}
                        <div className="row g-4 mb-5">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Номер счёта</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.invoiceNumber}
                                    onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Дата выставления</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.issueDate}
                                    onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Срок оплаты</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Плательщик */}
                        <div className="mb-5">
                            <label className="form-label fw-bold">Плательщик</label>
                            <select
                                className="form-select"
                                value={formData.payer}
                                onChange={e => setFormData({ ...formData, payer: e.target.value })}
                                required
                            >
                                <option value="">Выберите плательщика...</option>
                                <option value="1">ООО "Ромашка"</option>
                                <option value="2">ИП Иванов</option>
                                {/* В будущем — загрузка из API */}
                            </select>
                        </div>

                        {/* Товары / услуги */}
                        <div className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Позиции счёта</h5>
                                <button type="button" className="btn btn-sm btn-success" onClick={addItem}>
                                    <Plus size={16} /> Добавить позицию
                                </button>
                            </div>

                            {formData.items.map((item, index) => (
                                <div key={index} className="row g-3 mb-3 align-items-end border-bottom pb-3">
                                    <div className="col-md-5">
                                        <label className="form-label">Наименование</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.description}
                                            onChange={e => updateItem(index, 'description', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Кол-во</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="1"
                                            value={item.quantity}
                                            onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Цена</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            step="0.01"
                                            value={item.price}
                                            onChange={e => updateItem(index, 'price', Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Сумма</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={item.amount.toFixed(2)}
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-md-1 d-flex justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => removeItem(index)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="text-end mt-3">
                                <h5>Итого: {calculateTotal().toFixed(2)} ₽</h5>
                            </div>
                        </div>

                        {/* График оплаты */}
                        <div className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">График оплаты</h5>
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={addPayment}>
                                    Добавить этап
                                </button>
                            </div>

                            {formData.paymentSchedule.map((p, i) => (
                                <div key={i} className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Дата платежа</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={p.date}
                                            onChange={e => updatePayment(i, 'date', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">% от суммы</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            max="100"
                                            value={p.percent}
                                            onChange={e => updatePayment(i, 'percent', Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Кнопки */}
                        <div className="d-flex gap-3 justify-content-end mt-5">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => window.history.back()}>
                                <X size={18} className="me-2" /> Отмена
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <Save size={18} className="me-2" /> Сохранить счёт
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}