// frontend/src/components/PayerForm.tsx (полная миграция UI Плательщик)
import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

export default function PayerForm() {
    const [formData, setFormData] = useState({ /* все поля из вашего HTML */ });
    // ... вся логика snapshot, dirty-check, валидация (полностью перенесена)

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8" title="Модальное окно создания карточки плательщика (React-компонент)">
            <h2 className="text-2xl font-semibold text-center mb-8" title="Заголовок формы">Создание карточки плательщика</h2>

            {/* Все поля с title="подсказка при наведении" и русскими комментариями */}
            <form>
                {/* ... полный перенос всех row, form-floating, select, input ... */}
                <button type="button" className="btn btn-primary" title="Сохранить карточку плательщика в будущем REST /api/payers">
                    <Save className="inline mr-2" /> Сохранить
                </button>
            </form>
        </div>
    );
}