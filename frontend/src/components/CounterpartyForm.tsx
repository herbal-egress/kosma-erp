import { useEffect, useRef, useState } from 'react';
import { Plus, Save, Trash2, X } from 'lucide-react';

type CounterpartyFormData = {
    type: string;
    status: string;
    name: string;
    inn: string;
    kpp: string;
    ogrn: string;
    okpo: string;
    legalAddress: string;
    actualAddress: string;
    postalAddress: string;
    phone: string;
    email: string;
    website: string;
    director: string;
    comment: string;
};

export default function CounterpartyForm() {
    const [formData, setFormData] = useState<CounterpartyFormData>({
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
        comment: ''
    });

    const [goodsGroups, setGoodsGroups] = useState<string[]>(['']);
    const [dirty, setDirty] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);
    const initialSnapshot = useRef<string>('');

    // Формируем сериализованный снимок формы и массива групп товаров.
    const getSnapshot = () => {
        if (!formRef.current) {
            return '{}';
        }

        const formDataEntries = new FormData(formRef.current);
        const formObject = Object.fromEntries(formDataEntries);

        return JSON.stringify({
            form: formObject,
            goodsGroups
        });
    };

    // Запоминаем начальный снимок формы после первого рендера.
    useEffect(() => {
        const timerId = window.setTimeout(() => {
            initialSnapshot.current = getSnapshot();
        }, 120);

        return () => {
            window.clearTimeout(timerId);
        };
    }, []);

    const markDirty = () => {
        setDirty(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        markDirty();
    };

    const handleGoodsChange = (index: number, value: string) => {
        setGoodsGroups((prev) => prev.map((group, groupIndex) => (groupIndex === index ? value : group)));
        markDirty();
    };

    const addGoodsGroup = () => {
        setGoodsGroups((prev) => [...prev, '']);
        markDirty();
    };

    const removeGoodsGroup = (index: number) => {
        setGoodsGroups((prev) => {
            const next = prev.filter((_, groupIndex) => groupIndex !== index);
            return next.length > 0 ? next : [''];
        });
        markDirty();
    };

    // Блокируем случайное закрытие вкладки браузера при наличии изменений.
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (dirty && getSnapshot() !== initialSnapshot.current) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dirty, goodsGroups]);

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

    const cancelClose = () => {
        setShowConfirm(false);
    };

    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formRef.current?.checkValidity()) {
            formRef.current?.classList.add('was-validated');
            return;
        }

        alert('Карточка контрагента сохранена (демо-режим)');
        setDirty(false);
        initialSnapshot.current = getSnapshot();
    };

    return (
        <div className="container py-5" title="Форма создания карточки контрагента">
            <div className="card shadow-lg border-0 rounded-4" title="Карточка формы контрагента">
                <div className="card-header bg-primary text-white text-center py-4 position-relative" title="Заголовок формы контрагента">
                    <h2 className="mb-0" title="Название формы">Создание карточки контрагента</h2>
                    <button
                        type="button"
                        className="btn-close btn-close-white position-absolute top-0 end-0 mt-3 me-3"
                        onClick={handleClose}
                        aria-label="Закрыть"
                        title="Закрыть форму и вернуться назад"
                    />
                </div>

                <div className="card-body p-5" title="Основное содержимое формы контрагента">
                    <form ref={formRef} onSubmit={handleSave} noValidate title="Форма ввода данных контрагента">
                        <div className="row g-3 mb-4" title="Блок типа и статуса контрагента">
                            <div className="col-md-6" title="Поле типа контрагента">
                                <div className="form-floating" title="Контейнер поля типа контрагента">
                                    <select
                                        className="form-select"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        required
                                        title="Выберите тип контрагента"
                                    >
                                        <option value="Поставщик" title="Тип: поставщик">Поставщик</option>
                                        <option value="Покупатель" title="Тип: покупатель">Покупатель</option>
                                        <option value="Подрядчик" title="Тип: подрядчик">Подрядчик</option>
                                        <option value="Прочий" title="Тип: прочий">Прочий</option>
                                    </select>
                                    <label title="Подпись поля типа">Тип контрагента *</label>
                                </div>
                            </div>

                            <div className="col-md-6" title="Поле статуса карточки">
                                <div className="form-floating" title="Контейнер поля статуса">
                                    <select
                                        className="form-select"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                        title="Выберите текущий статус карточки"
                                    >
                                        <option value="Активен" title="Статус: активен">Активен</option>
                                        <option value="Неактивен" title="Статус: неактивен">Неактивен</option>
                                        <option value="На проверке" title="Статус: на проверке">На проверке</option>
                                    </select>
                                    <label title="Подпись поля статуса">Статус *</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4" title="Блок названия контрагента">
                            <div className="col-md-12" title="Поле полного наименования">
                                <div className="form-floating" title="Контейнер поля наименования">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        required
                                        title="Введите полное юридическое наименование"
                                    />
                                    <label title="Подпись поля наименования">Наименование *</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4" title="Блок регистрационных реквизитов">
                            <div className="col-md-3" title="Поле ИНН">
                                <div className="form-floating" title="Контейнер поля ИНН">
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
                                        title="Введите ИНН (10 или 12 цифр)"
                                    />
                                    <label title="Подпись поля ИНН">ИНН *</label>
                                </div>
                            </div>

                            <div className="col-md-3" title="Поле КПП">
                                <div className="form-floating" title="Контейнер поля КПП">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="kpp"
                                        value={formData.kpp}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        pattern="\d{9}"
                                        maxLength={9}
                                        title="Введите КПП (9 цифр, для ИП необязательно)"
                                    />
                                    <label title="Подпись поля КПП">КПП</label>
                                </div>
                            </div>

                            <div className="col-md-3" title="Поле ОГРН/ОГРНИП">
                                <div className="form-floating" title="Контейнер поля ОГРН/ОГРНИП">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="ogrn"
                                        value={formData.ogrn}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        pattern="\d{13}|\d{15}"
                                        title="Введите ОГРН (13 цифр) или ОГРНИП (15 цифр)"
                                    />
                                    <label title="Подпись поля ОГРН/ОГРНИП">ОГРН / ОГРНИП</label>
                                </div>
                            </div>

                            <div className="col-md-3" title="Поле ОКПО">
                                <div className="form-floating" title="Контейнер поля ОКПО">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="okpo"
                                        value={formData.okpo}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        title="Введите код ОКПО при наличии"
                                    />
                                    <label title="Подпись поля ОКПО">ОКПО</label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4" title="Блок групп товаров и услуг">
                            <div className="d-flex justify-content-between align-items-center mb-3" title="Заголовок раздела групп товаров">
                                <h5 className="mb-0" title="Название раздела">Группы товаров / услуг</h5>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={addGoodsGroup}
                                    title="Добавить новую группу товаров или услуг"
                                >
                                    <Plus size={16} className="me-1" /> Добавить
                                </button>
                            </div>

                            {goodsGroups.map((group, index) => (
                                <div key={`group-${index}`} className="input-group mb-2" title={`Строка группы товаров №${index + 1}`}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={group}
                                        onChange={(event) => handleGoodsChange(index, event.target.value)}
                                        placeholder="Например: Металлопрокат, Гидроцилиндры, Электродвигатели"
                                        title="Введите группу товаров/услуг для контрагента"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => removeGoodsGroup(index)}
                                        disabled={goodsGroups.length === 1}
                                        title="Удалить текущую группу"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="row g-3 mb-4" title="Блок адресов и контактов">
                            <div className="col-md-4" title="Поле юридического адреса">
                                <div className="form-floating" title="Контейнер поля юридического адреса">
                  <textarea
                      className="form-control"
                      name="legalAddress"
                      value={formData.legalAddress}
                      onChange={handleInputChange}
                      placeholder=" "
                      style={{ height: '80px' }}
                      title="Введите юридический адрес"
                  />
                                    <label title="Подпись юридического адреса">Юридический адрес</label>
                                </div>
                            </div>

                            <div className="col-md-4" title="Поле фактического адреса">
                                <div className="form-floating" title="Контейнер поля фактического адреса">
                  <textarea
                      className="form-control"
                      name="actualAddress"
                      value={formData.actualAddress}
                      onChange={handleInputChange}
                      placeholder=" "
                      style={{ height: '80px' }}
                      title="Введите фактический адрес"
                  />
                                    <label title="Подпись фактического адреса">Фактический адрес</label>
                                </div>
                            </div>

                            <div className="col-md-4" title="Поле почтового адреса">
                                <div className="form-floating" title="Контейнер поля почтового адреса">
                  <textarea
                      className="form-control"
                      name="postalAddress"
                      value={formData.postalAddress}
                      onChange={handleInputChange}
                      placeholder=" "
                      style={{ height: '80px' }}
                      title="Введите почтовый адрес"
                  />
                                    <label title="Подпись почтового адреса">Почтовый адрес</label>
                                </div>
                            </div>

                            <div className="col-md-4" title="Поле телефона">
                                <div className="form-floating" title="Контейнер поля телефона">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        title="Введите номер телефона"
                                    />
                                    <label title="Подпись телефона">Телефон</label>
                                </div>
                            </div>

                            <div className="col-md-4" title="Поле email">
                                <div className="form-floating" title="Контейнер поля email">
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        title="Введите основной e-mail"
                                    />
                                    <label title="Подпись email">E-mail</label>
                                </div>
                            </div>

                            <div className="col-md-4" title="Поле сайта">
                                <div className="form-floating" title="Контейнер поля сайта">
                                    <input
                                        type="url"
                                        className="form-control"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        title="Введите адрес сайта, начиная с https://"
                                    />
                                    <label title="Подпись сайта">Сайт</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4" title="Блок ответственного лица и комментария">
                            <div className="col-md-6" title="Поле ФИО руководителя">
                                <div className="form-floating" title="Контейнер поля руководителя">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="director"
                                        value={formData.director}
                                        onChange={handleInputChange}
                                        placeholder=" "
                                        title="Введите ФИО руководителя"
                                    />
                                    <label title="Подпись поля руководителя">Руководитель</label>
                                </div>
                            </div>

                            <div className="col-md-6" title="Поле комментария">
                                <div className="form-floating" title="Контейнер поля комментария">
                  <textarea
                      className="form-control"
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      placeholder=" "
                      style={{ height: '120px' }}
                      maxLength={1000}
                      title="Введите внутренний комментарий по контрагенту"
                  />
                                    <label title="Подпись поля комментария">Комментарий / примечания</label>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-3 justify-content-end mt-5" title="Панель действий формы">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleClose}
                                title="Отменить создание карточки и вернуться назад"
                            >
                                <X size={18} className="me-2" /> Отмена
                            </button>
                            <button type="submit" className="btn btn-primary" title="Сохранить карточку контрагента">
                                <Save size={18} className="me-2" /> Сохранить
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showConfirm && (
                <div
                    className="modal fade show"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                    tabIndex={-1}
                    title="Модальное окно подтверждения закрытия"
                >
                    <div className="modal-dialog modal-dialog-centered" title="Контейнер модального окна">
                        <div className="modal-content" title="Содержимое модального окна">
                            <div className="modal-header" title="Шапка модального окна">
                                <h5 className="modal-title" title="Заголовок предупреждения">Несохранённые изменения</h5>
                                <button type="button" className="btn-close" onClick={cancelClose} title="Закрыть окно предупреждения" />
                            </div>
                            <div className="modal-body" title="Текст предупреждения">
                                Есть несохранённые изменения. Закрыть без сохранения?
                            </div>
                            <div className="modal-footer" title="Кнопки подтверждения действия">
                                <button type="button" className="btn btn-secondary" onClick={cancelClose} title="Отменить закрытие формы">
                                    Отменить
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmClose}
                                    title="Подтвердить закрытие без сохранения"
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