import { useEffect, useRef, useState } from 'react';
import { Save, X } from 'lucide-react';
import { validatePayerForm } from '../utils/validation';

type PayerFormData = {
    legalForm: string;
    shortName: string;
    fullName: string;
    director: string;
    chiefAccountant: string;
    legalAddress: string;
    postalAddress: string;
    actualAddress: string;
    deliveryAddress: string;
    ogrn: string;
    registrationDate: string;
    registrationAuthority: string;
    inn: string;
    kpp: string;
    bik: string;
    bankName: string;
    corrAccount: string;
    settlementAccount: string;
    okpo: string;
    okved: string;
    phone: string;
    website: string;
    comment: string;
};

const initialFormData: PayerFormData = {
    legalForm: 'ООО',
    shortName: '',
    fullName: '',
    director: '',
    chiefAccountant: '',
    legalAddress: '',
    postalAddress: '',
    actualAddress: '',
    deliveryAddress: '',
    ogrn: '',
    registrationDate: '',
    registrationAuthority: '',
    inn: '',
    kpp: '',
    bik: '',
    bankName: '',
    corrAccount: '',
    settlementAccount: '',
    okpo: '',
    okved: '',
    phone: '',
    website: '',
    comment: ''
};

export default function PayerForm() {
    const [formData, setFormData] = useState<PayerFormData>(initialFormData);
    const [dirty, setDirty] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [validationError, setValidationError] = useState<string>('');

    const formRef = useRef<HTMLFormElement>(null);
    const initialSnapshot = useRef<string>('');

    const getSnapshot = () => {
        if (!formRef.current) {
            return '{}';
        }

        const values = new FormData(formRef.current);
        return JSON.stringify(Object.fromEntries(values));
    };

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            initialSnapshot.current = getSnapshot();
        }, 200);

        return () => {
            window.clearTimeout(timerId);
        };
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        setDirty(true);
    };

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

    const cancelClose = () => {
        setShowConfirm(false);
    };

    const handleSave = () => {
        const errors = validatePayerForm({
            shortName: formData.shortName,
            fullName: formData.fullName,
            director: formData.director,
            legalAddress: formData.legalAddress,
            inn: formData.inn,
            kpp: formData.kpp,
            ogrn: formData.ogrn,
            bik: formData.bik,
            website: formData.website
        });

        if (Object.keys(errors).length > 0) {
            setValidationError(Object.values(errors)[0]);
            return;
        }

        if (!formRef.current?.checkValidity()) {
            formRef.current?.classList.add('was-validated');
            return;
        }

        setValidationError('');
        alert('Карточка плательщика сохранена (демо)');
        setDirty(false);
        initialSnapshot.current = getSnapshot();
    };

    return (
        <div className="container py-5" title="Форма создания или редактирования карточки плательщика">
            <div className="card shadow-lg border-0 rounded-4" title="Карточка формы плательщика">
                <div className="card-header bg-primary text-white text-center py-4" title="Заголовок формы плательщика">
                    <h2 className="mb-0" title="Название формы">Создание карточки плательщика</h2>
                </div>

                <div className="card-body p-5" title="Основное содержимое формы">
                    <form ref={formRef} className="needs-validation" noValidate title="Форма реквизитов плательщика">
                        <div className="row g-3 mb-4" title="Блок основных реквизитов компании">
                            <div className="col-md-4" title="Поле организационно-правовой формы">
                                <div className="form-floating" title="Контейнер поля организационно-правовой формы">
                                    <select
                                        name="legalForm"
                                        value={formData.legalForm}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                        title="Выберите организационно-правовую форму"
                                    >
                                        <option value="ООО" title="Общество с ограниченной ответственностью">ООО</option>
                                        <option value="ИП" title="Индивидуальный предприниматель">ИП</option>
                                        <option value="АО" title="Акционерное общество">АО</option>
                                        <option value="ПАО" title="Публичное акционерное общество">ПАО</option>
                                    </select>
                                    <label title="Подпись поля ОПФ">ОПФ *</label>
                                </div>
                            </div>

                            <div className="col-md-4" title="Поле сокращённого наименования">
                                <div className="form-floating" title="Контейнер сокращённого наименования">
                                    <input
                                        name="shortName"
                                        value={formData.shortName}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        required
                                        title="Введите сокращённое наименование организации"
                                    />
                                    <label title="Подпись поля сокращённого наименования">Сокращённое наименование *</label>
                                </div>
                            </div>

                            <div className="col-md-4" title="Поле полного наименования">
                                <div className="form-floating" title="Контейнер полного наименования">
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        required
                                        title="Введите полное юридическое наименование организации"
                                    />
                                    <label title="Подпись полного наименования">Полное наименование *</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4" title="Блок руководства компании">
                            <div className="col-md-6" title="Поле руководителя">
                                <div className="form-floating" title="Контейнер поля руководителя">
                                    <input
                                        name="director"
                                        value={formData.director}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        required
                                        title="Введите ФИО руководителя"
                                    />
                                    <label title="Подпись поля руководителя">Руководитель *</label>
                                </div>
                            </div>

                            <div className="col-md-6" title="Поле главного бухгалтера">
                                <div className="form-floating" title="Контейнер поля главного бухгалтера">
                                    <input
                                        name="chiefAccountant"
                                        value={formData.chiefAccountant}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        title="Введите ФИО главного бухгалтера"
                                    />
                                    <label title="Подпись поля главного бухгалтера">Главный бухгалтер</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4" title="Блок адресов">
                            <div className="col-md-6" title="Поле юридического адреса">
                                <div className="form-floating" title="Контейнер юридического адреса">
                  <textarea
                      name="legalAddress"
                      value={formData.legalAddress}
                      onChange={handleChange}
                      className="form-control ui-textarea-md"
                      required
                      title="Введите юридический адрес"
                  />
                                    <label title="Подпись юридического адреса">Юридический адрес *</label>
                                </div>
                            </div>

                            <div className="col-md-6" title="Поле почтового адреса">
                                <div className="form-floating" title="Контейнер почтового адреса">
                  <textarea
                      name="postalAddress"
                      value={formData.postalAddress}
                      onChange={handleChange}
                      className="form-control ui-textarea-md"
                      title="Введите почтовый адрес"
                  />
                                    <label title="Подпись почтового адреса">Почтовый адрес</label>
                                </div>
                            </div>

                            <div className="col-md-6" title="Поле фактического адреса">
                                <div className="form-floating" title="Контейнер фактического адреса">
                  <textarea
                      name="actualAddress"
                      value={formData.actualAddress}
                      onChange={handleChange}
                      className="form-control ui-textarea-md"
                      title="Введите фактический адрес"
                  />
                                    <label title="Подпись фактического адреса">Фактический адрес</label>
                                </div>
                            </div>

                            <div className="col-md-6" title="Поле адреса доставки">
                                <div className="form-floating" title="Контейнер адреса доставки">
                  <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      className="form-control ui-textarea-md"
                      title="Введите адрес доставки документов или грузов"
                  />
                                    <label title="Подпись адреса доставки">Адрес доставки</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4" title="Блок регистрационных реквизитов">
                            <div className="col-md-3" title="Поле ОГРН">
                                <div className="form-floating" title="Контейнер поля ОГРН">
                                    <input
                                        name="ogrn"
                                        value={formData.ogrn}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        pattern="\d{13}|\d{15}"
                                        title="Введите ОГРН (13 цифр) или ОГРНИП (15 цифр)"
                                    />
                                    <label title="Подпись поля ОГРН">ОГРН / ОГРНИП</label>
                                </div>
                            </div>

                            <div className="col-md-3" title="Поле даты регистрации">
                                <div className="form-floating" title="Контейнер даты регистрации">
                                    <input
                                        name="registrationDate"
                                        value={formData.registrationDate}
                                        onChange={handleChange}
                                        type="date"
                                        className="form-control"
                                        title="Выберите дату регистрации"
                                    />
                                    <label title="Подпись даты регистрации">Дата регистрации</label>
                                </div>
                            </div>

                            <div className="col-md-6" title="Поле регистрирующего органа">
                                <div className="form-floating" title="Контейнер поля регистрирующего органа">
                                    <input
                                        name="registrationAuthority"
                                        value={formData.registrationAuthority}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        title="Укажите орган регистрации"
                                    />
                                    <label title="Подпись регистрирующего органа">Регистрирующий орган</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4" title="Блок налоговых и банковских реквизитов">
                            <div className="col-md-3" title="Поле ИНН">
                                <div className="form-floating" title="Контейнер поля ИНН">
                                    <input
                                        name="inn"
                                        value={formData.inn}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
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
                                        name="kpp"
                                        value={formData.kpp}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        pattern="\d{9}"
                                        maxLength={9}
                                        title="Введите КПП (9 цифр)"
                                    />
                                    <label title="Подпись поля КПП">КПП</label>
                                </div>
                            </div>

                            <div className="col-md-3" title="Поле БИК">
                                <div className="form-floating" title="Контейнер поля БИК">
                                    <input
                                        name="bik"
                                        value={formData.bik}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        pattern="\d{9}"
                                        maxLength={9}
                                        title="Введите БИК банка (9 цифр)"
                                    />
                                    <label title="Подпись поля БИК">БИК</label>
                                </div>
                            </div>

                            <div className="col-md-3" title="Поле ОКПО">
                                <div className="form-floating" title="Контейнер поля ОКПО">
                                    <input
                                        name="okpo"
                                        value={formData.okpo}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        title="Введите код ОКПО"
                                    />
                                    <label title="Подпись поля ОКПО">ОКПО</label>
                                </div>
                            </div>

                            <div className="col-md-6" title="Поле названия банка">
                                <div className="form-floating" title="Контейнер поля банка">
                                    <input
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        title="Введите название банка"
                                    />
                                    <label title="Подпись поля банка">Банк</label>
                                </div>
                            </div>

                            <div className="col-md-3" title="Поле корреспондентского счёта">
                                <div className="form-floating" title="Контейнер корреспондентского счёта">
                                    <input
                                        name="corrAccount"
                                        value={formData.corrAccount}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        title="Введите корреспондентский счёт"
                                    />
                                    <label title="Подпись корр. счёта">Корр. счёт</label>
                                </div>
                            </div>

                            <div className="col-md-3" title="Поле расчётного счёта">
                                <div className="form-floating" title="Контейнер расчётного счёта">
                                    <input
                                        name="settlementAccount"
                                        value={formData.settlementAccount}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        title="Введите расчётный счёт"
                                    />
                                    <label title="Подпись расчётного счёта">Расчётный счёт</label>
                                </div>
                            </div>

                            <div className="col-md-3" title="Поле ОКВЭД">
                                <div className="form-floating" title="Контейнер поля ОКВЭД">
                                    <input
                                        name="okved"
                                        value={formData.okved}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        title="Введите основной код ОКВЭД"
                                    />
                                    <label title="Подпись поля ОКВЭД">ОКВЭД</label>
                                </div>
                            </div>
                        </div>

                        <div className="row g-3 mb-4" title="Блок контактов">
                            <div className="col-md-6" title="Поле телефона">
                                <div className="form-floating" title="Контейнер поля телефона">
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        type="text"
                                        className="form-control"
                                        title="Введите контактный телефон"
                                    />
                                    <label title="Подпись поля телефона">Телефон</label>
                                </div>
                            </div>

                            <div className="col-md-6" title="Поле сайта">
                                <div className="form-floating" title="Контейнер поля сайта">
                                    <input
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        type="url"
                                        className="form-control"
                                        title="Введите адрес сайта в формате https://..."
                                    />
                                    <label title="Подпись поля сайта">Сайт</label>
                                </div>
                            </div>
                        </div>

                        <div className="form-floating mb-3" title="Поле комментария">
              <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  className="form-control ui-textarea-lg"
                  title="Введите дополнительный комментарий"
              />
                            <label title="Подпись поля комментария">Комментарий</label>
                        </div>
                        {validationError && (
                            <div className="alert alert-danger mt-3" title="Сообщение об ошибке валидации">
                                {validationError}
                            </div>
                        )}
                    </form>

                    <div className="d-flex gap-3 justify-content-end mt-5" title="Панель действий формы">
                        <button type="button" className="btn btn-outline-secondary" onClick={handleClose} title="Отменить изменения и вернуться назад">
                            <X size={18} className="me-2" /> Отмена
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave} title="Проверить и сохранить карточку плательщика">
                            <Save size={18} className="me-2" /> Сохранить
                        </button>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <div
                    className="modal fade show ui-modal-overlay"
                    tabIndex={-1}
                    title="Модальное окно подтверждения закрытия"
                >
                    <div className="modal-dialog modal-dialog-centered" title="Контейнер модального окна">
                        <div className="modal-content" title="Содержимое окна подтверждения">
                            <div className="modal-header" title="Шапка окна подтверждения">
                                <h5 className="modal-title" title="Заголовок предупреждения">Несохранённые изменения</h5>
                                <button type="button" className="btn-close" onClick={cancelClose} title="Закрыть окно предупреждения" />
                            </div>
                            <div className="modal-body" title="писание действия закрытия">
                                В форме есть несохранённые изменения. Закрыть без сохранения?
                            </div>
                            <div className="modal-footer" title="Кнопки выбора действия">
                                <button type="button" className="btn btn-secondary" onClick={cancelClose} title="Вернуться к редактированию">
                                    Продолжить редактирование
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmClose} title="Подтвердить закрытие без сохранения">
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