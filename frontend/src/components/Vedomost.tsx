import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    Search,
    Plus,
    Download,
    Upload
} from 'lucide-react';

// Типы данных для строк ведомости.
type FullRow = {
    id: number;
    code: string;
    name: string;
    unit: string;
    projectQty: number;
    producedQty: number;
    purchasedQty: number;
    remainQty: number;
    status: string;
    owner: string;
    deadline: string;
    note: string;
};

type ManufactureRow = {
    id: number;
    code: string;
    name: string;
    unit: string;
    planQty: number;
    producedQty: number;
    remainQty: number;
    workshop: string;
    status: string;
    plannedDate: string;
    factDate: string;
};

type PurchaseRow = {
    id: number;
    code: string;
    name: string;
    unit: string;
    planQty: number;
    orderedQty: number;
    deliveredQty: number;
    remainQty: number;
    supplier: string;
    status: string;
    deliveryDate: string;
};

type ScrollState = {
    canLeft: boolean;
    canRight: boolean;
};

type TabKey = 'full' | 'manufacture' | 'purchase';

const FULL_ROWS: FullRow[] = [
    {
        id: 1,
        code: '1308-001',
        name: 'Гидроцилиндр подъёма кузова 160×1000',
        unit: 'шт',
        projectQty: 4,
        producedQty: 2,
        purchasedQty: 0,
        remainQty: 2,
        status: 'В работе',
        owner: 'Иванов И.И.',
        deadline: '15.04.2026',
        note: 'Отклонение +12 дн'
    },
    {
        id: 2,
        code: '1308-002',
        name: 'Шток хромированный 80×1500',
        unit: 'шт',
        projectQty: 6,
        producedQty: 4,
        purchasedQty: 0,
        remainQty: 2,
        status: 'В работе',
        owner: 'Петров П.П.',
        deadline: '18.04.2026',
        note: 'Ожидается мехобработка'
    },
    {
        id: 3,
        code: '1308-003',
        name: 'Уплотнительный комплект УК-160',
        unit: 'компл',
        projectQty: 10,
        producedQty: 0,
        purchasedQty: 6,
        remainQty: 4,
        status: 'Закуп',
        owner: 'Сидоров С.С.',
        deadline: '20.04.2026',
        note: 'Поставка частями'
    }
];

const MANUFACTURE_ROWS: ManufactureRow[] = [
    {
        id: 1,
        code: '1308-001',
        name: 'Гидроцилиндр подъёма кузова 160×1000',
        unit: 'шт',
        planQty: 4,
        producedQty: 2,
        remainQty: 2,
        workshop: 'Цех №3',
        status: 'В работе',
        plannedDate: '10.03.2026',
        factDate: '—'
    },
    {
        id: 2,
        code: '1308-002',
        name: 'Шток хромированный 80×1500',
        unit: 'шт',
        planQty: 6,
        producedQty: 4,
        remainQty: 2,
        workshop: 'Цех №2',
        status: 'В работе',
        plannedDate: '12.03.2026',
        factDate: '—'
    }
];

const PURCHASE_ROWS: PurchaseRow[] = [
    {
        id: 5,
        code: '1308-005',
        name: 'Насос гидравлический 63 л/мин',
        unit: 'шт',
        planQty: 2,
        orderedQty: 2,
        deliveredQty: 0,
        remainQty: 2,
        supplier: 'ООО "ГидроТех"',
        status: 'Ожидание',
        deliveryDate: '20.03.2026'
    },
    {
        id: 6,
        code: '1308-006',
        name: 'Гидрораспределитель Р80',
        unit: 'шт',
        planQty: 3,
        orderedQty: 3,
        deliveredQty: 1,
        remainQty: 2,
        supplier: 'ООО "ПромГидро"',
        status: 'Частично поставлено',
        deliveryDate: '25.03.2026'
    }
];

export default function Vedomost() {
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>('full');
    const [searchValue, setSearchValue] = useState('');

    // Состояние кнопок прокрутки для каждой вкладки.
    const [scrollMap, setScrollMap] = useState<Record<TabKey, ScrollState>>({
        full: { canLeft: false, canRight: true },
        manufacture: { canLeft: false, canRight: true },
        purchase: { canLeft: false, canRight: true }
    });

    const fullRef = useRef<HTMLDivElement | null>(null);
    const manufactureRef = useRef<HTMLDivElement | null>(null);
    const purchaseRef = useRef<HTMLDivElement | null>(null);

    // Фильтрация демонстрационных данных по поиску.
    const filteredFullRows = useMemo(() => {
        const normalized = searchValue.trim().toLowerCase();
        if (!normalized) {
            return FULL_ROWS;
        }

        return FULL_ROWS.filter((row) => {
            const haystack = `${row.code} ${row.name} ${row.status} ${row.owner} ${row.note}`.toLowerCase();
            return haystack.includes(normalized);
        });
    }, [searchValue]);

    const filteredManRows = useMemo(() => {
        const normalized = searchValue.trim().toLowerCase();
        if (!normalized) {
            return MANUFACTURE_ROWS;
        }

        return MANUFACTURE_ROWS.filter((row) => {
            const haystack = `${row.code} ${row.name} ${row.status} ${row.workshop}`.toLowerCase();
            return haystack.includes(normalized);
        });
    }, [searchValue]);

    const filteredPurchaseRows = useMemo(() => {
        const normalized = searchValue.trim().toLowerCase();
        if (!normalized) {
            return PURCHASE_ROWS;
        }

        return PURCHASE_ROWS.filter((row) => {
            const haystack = `${row.code} ${row.name} ${row.status} ${row.supplier}`.toLowerCase();
            return haystack.includes(normalized);
        });
    }, [searchValue]);

    // Получение ref-элемента активной вкладки.
    const getContainerByTab = (tab: TabKey) => {
        if (tab === 'full') {
            return fullRef.current;
        }

        if (tab === 'manufacture') {
            return manufactureRef.current;
        }

        return purchaseRef.current;
    };

    // Обновление доступности кнопок прокрутки без прямых DOM-манипуляций.
    const recalcScrollState = (tab: TabKey, element: HTMLDivElement | null) => {
        if (!element) {
            return;
        }

        const canLeft = element.scrollLeft > 0;
        const canRight = element.scrollLeft + element.clientWidth < element.scrollWidth - 1;

        setScrollMap((prev) => {
            const current = prev[tab];
            if (current.canLeft === canLeft && current.canRight === canRight) {
                return prev;
            }

            return {
                ...prev,
                [tab]: { canLeft, canRight }
            };
        });
    };

    // При смене вкладки пересчитываем состояние кнопок после рендера.
    useEffect(() => {
        const timerId = window.setTimeout(() => {
            recalcScrollState(activeTab, getContainerByTab(activeTab));
        }, 0);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [activeTab]);

    // Прокрутка таблицы влево/вправо.
    const handleScrollBy = (tab: TabKey, delta: number) => {
        const container = getContainerByTab(tab);
        if (!container) {
            return;
        }

        container.scrollBy({ left: delta, behavior: 'smooth' });

        // Через небольшую задержку пересчитываем доступность кнопок после анимации.
        window.setTimeout(() => {
            recalcScrollState(tab, container);
        }, 180);
    };

    const wrapperClassName = `container-fluid py-4 ${darkMode ? 'bg-dark text-light' : 'bg-light'}`;

    return (
        <div className={wrapperClassName} title="Ведомость оборудования и материалов: основной экран с вкладками и таблицами">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h2 className="mb-0" title="Название ведомости и номер демонстрационного документа">
                    Ведомость оборудования и материалов № 1308
                </h2>

                <div className="d-flex gap-2 align-items-center flex-wrap">
                    <div className="input-group ui-input-group-wide">
            <span className="input-group-text bg-transparent border-end-0" title="Иконка быстрого поиска по таблицам">
              <Search size={18} />
            </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder="Поиск по наименованию, коду, статусу, ответственному..."
                            title="Поле поиска: фильтрует строки во всех вкладках"
                        />
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setDarkMode((prev) => !prev)}
                        title="Переключить светлую/тёмную тему интерфейса"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        title="Добавить новую позицию в ведомость (демо-кнопка)"
                    >
                        <Plus size={18} className="me-1" />
                        Добавить
                    </button>

                    <div className="btn-group" role="group" aria-label="Экспорт и импорт" title="Группа действий экспорта и импорта">
                        <button
                            type="button"
                            className="btn btn-outline-success"
                            title="Экспортировать ведомость в Excel или PDF (демо-кнопка)"
                        >
                            <Download size={18} className="me-1" />
                            Экспорт
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-warning"
                            title="Импортировать позиции из Excel (демо-кнопка)"
                        >
                            <Upload size={18} className="me-1" />
                            Импорт
                        </button>
                    </div>
                </div>
            </div>

            <ul className="nav nav-tabs mb-4" role="tablist" title="Навигация по разделам ведомости">
                <li className="nav-item" role="presentation">
                    <button
                        type="button"
                        role="tab"
                        className={`nav-link ${activeTab === 'full' ? 'active' : ''}`}
                        onClick={() => setActiveTab('full')}
                        title="Открыть вкладку полной ведомости"
                    >
                        Полная ведомость
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        type="button"
                        role="tab"
                        className={`nav-link ${activeTab === 'manufacture' ? 'active' : ''}`}
                        onClick={() => setActiveTab('manufacture')}
                        title="Открыть вкладку изготовляемых позиций"
                    >
                        Изготовление
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        type="button"
                        role="tab"
                        className={`nav-link ${activeTab === 'purchase' ? 'active' : ''}`}
                        onClick={() => setActiveTab('purchase')}
                        title="Открыть вкладку закупаемых позиций"
                    >
                        Закуп
                    </button>
                </li>
            </ul>

            {activeTab === 'full' && (
                <section title="Вкладка полной ведомости">
                    <TableSectionControls
                        canLeft={scrollMap.full.canLeft}
                        canRight={scrollMap.full.canRight}
                        onLeft={() => handleScrollBy('full', -300)}
                        onRight={() => handleScrollBy('full', 300)}
                        leftTitle="Прокрутить полную ведомость влево"
                        rightTitle="Прокрутить полную ведомость вправо"
                    />

                    <div
                        id="table-scroll-full"
                        onScroll={(event) => recalcScrollState('full', event.currentTarget)}
                        ref={fullRef}
                        className="table-responsive horizontal-scroll-wrapper ui-scroll-x"
                        title="Горизонтально прокручиваемая таблица полной ведомости"
                    >
                        <table className="table table-bordered table-hover table-sm align-middle" title="Таблица полной ведомости">
                            <thead className="table-primary">
                            <tr>
                                <th title="Номер позиции">№</th>
                                <th title="Внутренний код позиции">Код</th>
                                <th title="Наименование материала или оборудования">Наименование</th>
                                <th title="Единица измерения">Ед.изм</th>
                                <th title="Плановое количество по проекту">Кол-во проект</th>
                                <th title="Количество, изготовленное на предприятии">Изготовлено</th>
                                <th title="Количество, закупленное у поставщиков">Закуплено</th>
                                <th title="Оставшееся количество к закрытию">Остаток</th>
                                <th title="Текущий статус позиции">Статус</th>
                                <th title="Ответственный сотрудник">Ответственный</th>
                                <th title="Плановый срок">Срок</th>
                                <th title="Комментарий или отклонение">Примечания</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredFullRows.map((row) => (
                                <tr key={row.id} title={`Строка полной ведомости: позиция ${row.code}`}>
                                    <td title="Номер позиции">{row.id}</td>
                                    <td title="Код позиции">{row.code}</td>
                                    <td title="Наименование позиции">{row.name}</td>
                                    <td title="Единица измерения">{row.unit}</td>
                                    <td title="Плановое количество">{row.projectQty}</td>
                                    <td title="Изготовленное количество">{row.producedQty}</td>
                                    <td title="Закупленное количество">{row.purchasedQty}</td>
                                    <td title="Остаток к закрытию">{row.remainQty}</td>
                                    <td title="Статус позиции">{row.status}</td>
                                    <td title="Ответственный">{row.owner}</td>
                                    <td title="Срок выполнения">{row.deadline}</td>
                                    <td title="Примечание">{row.note}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {activeTab === 'manufacture' && (
                <section title="Вкладка изготовляемых позиций">
                    <TableSectionControls
                        canLeft={scrollMap.manufacture.canLeft}
                        canRight={scrollMap.manufacture.canRight}
                        onLeft={() => handleScrollBy('manufacture', -300)}
                        onRight={() => handleScrollBy('manufacture', 300)}
                        leftTitle="Прокрутить раздел изготовления влево"
                        rightTitle="Прокрутить раздел изготовления вправо"
                    />

                    <div
                        id="table-scroll-manufacture"
                        className="table-responsive horizontal-scroll-wrapper ui-scroll-x"
                        onScroll={(event) => recalcScrollState('manufacture', event.currentTarget)}
                        ref={manufactureRef}
                        title="Горизонтально прокручиваеая таблица изготовления"
                    >
                        <table className="table table-bordered table-hover table-sm align-middle" title="Таблица изготовляемых позиций">
                            <thead className="table-success">
                            <tr>
                                <th title="Номер позиции">№</th>
                                <th title="Код позиции">Код</th>
                                <th title="Наименование">Наименование</th>
                                <th title="Единица измерения">Ед.изм</th>
                                <th title="Плановое количество">Кол-во план</th>
                                <th title="Изготовленное количество">Изготовлено</th>
                                <th title="Оставшееся количество">Остаток</th>
                                <th title="Ответственный цех">Цех / участок</th>
                                <th title="Статус выполнения">Статус</th>
                                <th title="Плановая дата">Плановая дата</th>
                                <th title="Фактическая дата">Факт. дата</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredManRows.map((row) => (
                                <tr key={row.id} title={`Строка изготовления: позиция ${row.code}`}>
                                    <td title="Номер позиции">{row.id}</td>
                                    <td title="Код позиции">{row.code}</td>
                                    <td title="Наименование позиции">{row.name}</td>
                                    <td title="Единица измерения">{row.unit}</td>
                                    <td title="Плановое количество">{row.planQty}</td>
                                    <td title="Изготовленное количество">{row.producedQty}</td>
                                    <td title="Оставшееся количество">{row.remainQty}</td>
                                    <td title="Цех/участок">{row.workshop}</td>
                                    <td title="Статус">{row.status}</td>
                                    <td title="Плановая дата">{row.plannedDate}</td>
                                    <td title="Фактическая дата">{row.factDate}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {activeTab === 'purchase' && (
                <section title="Вкладка закупаемых позиций">
                    <TableSectionControls
                        canLeft={scrollMap.purchase.canLeft}
                        canRight={scrollMap.purchase.canRight}
                        onLeft={() => handleScrollBy('purchase', -300)}
                        onRight={() => handleScrollBy('purchase', 300)}
                        leftTitle="Прокрутить раздел закупа влево"
                        rightTitle="Прокрутить раздел закупа вправо"
                    />

                    <div
                        id="table-scroll-purchase"
                        className="table-responsive horizontal-scroll-wrapper ui-scroll-x"
                        onScroll={(event) => recalcScrollState('purchase', event.currentTarget)}
                        ref={purchaseRef}
                        title="Горизонтально прокручиваемая таблица закупа"
                    >
                        <table className="table table-bordered table-hover table-sm align-middle" title="Таблица закупаемых позиций">
                            <thead className="table-info">
                            <tr>
                                <th title="Номер позиции">№</th>
                                <th title="Код позиции">Код</th>
                                <th title="Наименование">Наименование</th>
                                <th title="Единица измерения">Ед.изм</th>
                                <th title="Плановое количество">Кол-во план</th>
                                <th title="Заказанное количество">Заказано</th>
                                <th title="Поставленное количество">Поставлено</th>
                                <th title="Оставшееся количество">Остаток</th>
                                <th title="Поставщик">Поставщик</th>
                                <th title="Статус поставки">Статус</th>
                                <th title="Срок поставки">Срок поставки</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredPurchaseRows.map((row) => (
                                <tr key={row.id} title={`Строка закупа: позиция ${row.code}`}>
                                    <td title="Номер позиции">{row.id}</td>
                                    <td title="Код позиции">{row.code}</td>
                                    <td title="Наименование позиции">{row.name}</td>
                                    <td title="Единица измерения">{row.unit}</td>
                                    <td title="Плановое количество">{row.planQty}</td>
                                    <td title="Заказанное количество">{row.orderedQty}</td>
                                    <td title="Поставленное количество">{row.deliveredQty}</td>
                                    <td title="Оставшееся количество">{row.remainQty}</td>
                                    <td title="Поставщик">{row.supplier}</td>
                                    <td title="Статус">{row.status}</td>
                                    <td title="Срок поставки">{row.deliveryDate}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </div>
    );
}

type TableSectionControlsProps = {
    canLeft: boolean;
    canRight: boolean;
    onLeft: () => void;
    onRight: () => void;
    leftTitle: string;
    rightTitle: string;
};

function TableSectionControls(props: TableSectionControlsProps) {
    return (
        <div className="d-flex justify-content-end gap-2 mb-2" title="Панель горизонтальной прокрутки таблицы">
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={props.onLeft}
                disabled={!props.canLeft}
                title={props.leftTitle}
            >
                <ChevronLeft size={18} />
            </button>
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={props.onRight}
                disabled={!props.canRight}
                title={props.rightTitle}
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
}