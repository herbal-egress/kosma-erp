// src/components/CounterpartyForm.tsx
import { useState, useEffect, useRef } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CounterpartyForm() {
    const [formData, setFormData] = useState({
        type: 'Поставщик',
        status: 'Активен',
        name: '',
        inn: '',
        kpp: '',
        ogrn: '',
        okpo: '',
        legalAddress: '',
        actualAddress: '',
        postalAddress: '',
        phone: '',
        email: '',
        website: '',
        director: '',
        comment: '',
    });

    const [goodsGroups, setGoodsGroups] = useState<string[]>(['']);
    const [dirty, setDirty] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [forceClose, setForceClose] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);
    const initialSnapshot = useRef<string>('');

    // ─────────────────────────────────────────────────────────────
    // Снимок состояния формы для проверки изменений
    // ─────────────────────────────────────────────────────────────
    const getSnapshot = () => {
        if (!formRef.current) return '{}';

        const fd = new FormData(formRef.current);
        const formObj = Object.fromEntries(fd);

        return JSON.stringify({
            form: formObj,
            goods: goodsGroups,
        });
    };

    useEffect(() => {
        // Сохраняем начальное состояние через небольшую задержку
        const timer = setTimeout(() => {
            initialSnapshot.current = getSnapshot();
        }, 120);

        return () => clearTimeout(timer);
    }, []);

    // ─────────────────────────────────────────────────────────────
    // Отслеживание изменений
    // ─────────────────────────────────────────────────────────────
    const markDirty = () => {
        setDirty(true);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        markDirty();
    };

    const handleGoodsChange = (index: number, value: string) => {
        const newGroups = [...goodsGroups];
        newGroups[index] = value;
        setGoodsGroups(newGroups);
        markDirty();
    };

    const addGoodsGroup = () => {
        setGoodsGroups((prev) => [...prev, '']);
        markDirty();
    };

    const removeGoodsGroup = (index: number) => {
        setGoodsGroups((prev) => prev.filter((_, i) => i !== index));
        markDirty();
    };

    // ─────────────────────────────────────────────────────────────
    // Защита от случайного закрытия / ухода со страницы
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

    // ─────────────────────────────────────────────────────────────
    // Логика закрытия формы с подтверждением
    // ─────────────────────────────────────────────────────────────
    const handleClose = () => {
        if (!dirty || getSnapshot() === initialSnapshot.current) {
            // можно закрыть без вопросов
            window.history.back();
            return;
        }

        setShowConfirm(true);
    };

    const confirmClose = () => {
        setShowConfirm(false);
        setForceClose(true);
        setDirty(false);
        window.history.back();
    };

    const cancelClose = () => {
        setShowConfirm(false);
    };

    // ─────────────────────────────────────────────────────────────
    // Сохранение (демо-валидация + заглушка под API)
    // ─────────────────────────────────────────────────────────────
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formRef.current?.checkValidity()) {
            formRef.current?.classList.add('was-validated');
            return;
        }

        // Здесь в будущем будет fetch('/api/counterparties', { method: 'POST', body: ... })
        alert('Карточка контрагента сохранена (демо-режим)');

        setDirty(false);
        initialSnapshot.current = getSnapshot(); // сбрасываем "грязность"
    };

    return (
        <div className="container py-5">
            <div className="card shadow-lg border-0 rounded-4">
                <div className="card-header bg-primary text-white text-center py-4 position-relative">
                    <h2 className="mb-0">Создание карточки контрагента</h2>
                    <button
                        type="button"
                        className="btn-close btn-close-white position-absolute top-0 end-0 mt-3 me-3"
                        onClick={handleClose}
                        aria-label="Закрыть"
                        title="Закрыть форму (при несохранённых изменениях будет подтверждение)"
                    ></button>
                </div>

                <div className="card-body p-5">
                    <form ref={formRef} onSubmit={handleSave} noValidate>
                        {/* ─────────────────────────────────────────────────────────────
                Основные поля
            ───────────────────────────────────────────────────────────── */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <select
                                        className="form-select"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        required
                                        title="Тип контрагента — влияет на доступные операции в системе"
                                    >
                                        <option value="Поставщик">Поставщик</option>
                                        <option value="Покупатель">Покупатель</option>
                                        <option value="Подрядчик">Подрядчик</option>
                                        <option value="Прочий">Прочий</option>
                                    </select>
                                    <label>Тип контрагента *</label>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-floating">
                                    <select
                                        className="form-select"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                        title="Статус карточки — влияет на возможность проведения операций"
                                    >
                                        <option value="Активен">Активен</option>
                                        <option value="Неактивен">Неактивен</option>
                                        <option value="На проверке">На проверке</option>
                                    </select>
                                    <label>Статус *</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-12">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        required
                                        title="Полное наименование контрагента (из ЕГРЮЛ/ЕГРИП)"
                                    />
                                    <label>Наименование *</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="inn"
                                        value={formData.inn}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        pattern="\d{10}|\d{12}"
                                        maxLength={12}
                                        required
                                        title="ИНН — 10 или 12 цифр"
                                    />
                                    <label>ИНН *</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="kpp"
                                        value={formData.kpp}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        pattern="\d{9}"
                                        maxLength={9}
                                        title="КПП — 9 цифр (необязательно для ИП)"
                                    />
                                    <label>КПП</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="ogrn"
                                        value={formData.ogrn}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        pattern="\d{13}|\d{15}"
                                        title="ОГРН / ОГРНИП"
                                    />
                                    <label>ОГРН / ОГРНИП</label>
                                </div>
                            </div>
                        </div>

                        {/* ─────────────────────────────────────────────────────────────
                Группы товаров / услуг
            ───────────────────────────────────────────────────────────── */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Группы товаров / услуг</h5>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={addGoodsGroup}
                                    title="Добавить ещё одну группу товаров / услуг"
                                >
                                    <Plus size={16} className="me-1" /> Добавить
                                </button>
                            </div>

                            {goodsGroups.map((group, index) => (
                                <div key={index} className="input-group mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={group}
                                        onChange={(e) => handleGoodsChange(index, e.target.value)}
                                        placeholder="Например: Металлопрокат, Гидроцилиндры, Электродвигатели..."
                                        title="Группа товаров / услуг, с которыми работает данный контрагент"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => removeGoodsGroup(index)}
                                        disabled={goodsGroups.length === 1}
                                        title="Удалить группу"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* ─────────────────────────────────────────────────────────────
                Контактные и адресные данные
            ───────────────────────────────────────────────────────────── */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-12">
                                <div className="form-floating">
                  <textarea
                      className="form-control"
                      name="legalAddress"
                      value={formData.legalAddress}
                      onChange={handleInputChange}
                      placeholder=" "
                      style={{ height: '80px' }}
                      title="Юридический адрес (из ЕГРЮЛ)"
                  />
                                    <label>Юридический адрес</label>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        title="Телефон(ы) в любом формате"
                                    />
                                    <label>Телефон</label>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        title="Основной e-mail для переписки"
                                    />
                                    <label>E-mail</label>
                                </div>
                            </div>
                        </div>

                        {/* Комментарий */}
                        <div className="mb-4">
                            <div className="form-floating">
                <textarea
                    className="form-control"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder=" "
                    style={{ height: '120px' }}
                    maxLength={1000}
                    title="Внутренние заметки, особенности сотрудничества, риски и т.д."
                />
                                <label>Комментарий / примечания</label>
                            </div>
                        </div>

                        {/* Кнопки действий */}
                        <div className="d-flex gap-3 justify-content-end mt-5">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleClose}
                                title="Отменить создание и вернуться назад"
                            >
                                <X size={18} className="me-2" /> Отмена
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                title="Сохранить карточку контрагента в базе"
                            >
                                <Save size={18} className="me-2" /> Сохранить
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Модальное окно подтверждения закрытия */}
            {showConfirm && (
                <div
                    className="modal fade show"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                    tabIndex={-1}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Несохранённые изменения</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={cancelClose}
                                ></button>
                            </div>
                            <div className="modal-body">
                                Есть несохранённые изменения. Закрыть без сохранения?
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cancelClose}
                                >
                                    Отменить
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmClose}
                                >
                                    Закрыть без сохранения
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}