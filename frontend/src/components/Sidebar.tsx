// frontend/src/components/Sidebar.tsx
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Truck, Receipt, AlertTriangle, FileEdit } from 'lucide-react';

export default function Sidebar() {
    return (
        <nav className="w-72 bg-white border-r border-gray-200 p-6 flex flex-col h-full" title="Боковая панель навигации BPM-ERP">
            <h1 className="text-2xl font-bold text-blue-700 mb-10">KOSMA ERP</h1>

            <div className="space-y-2">
                <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700" title="Ведомость оборудования и материалов (основной экран)">
                    <LayoutDashboard size={20} /> Ведомость
                </Link>
                <Link to="/payer" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700" title="Создание / редактирование карточки плательщика">
                    <Users size={20} /> Плательщик
                </Link>
                <Link to="/invoice" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700" title="Создание нового счёта">
                    <Receipt size={20} /> Счёт
                </Link>

                {/* ЗАГОТОВКИ */}
                <Link to="/deviation-card" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700" title="Карта отклонений (форма)">
                    <AlertTriangle size={20} /> Карта отклонений
                </Link>
                <Link to="/deviation-registry" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700" title="Реестр всех карт отклонений">
                    <FileText size={20} /> Реестр отклонений
                </Link>
                <Link to="/order-counterparty" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700" title="Заказ контрагенту">
                    <Truck size={20} /> Заказ контрагенту
                </Link>
                <Link to="/orders-registry" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700" title="Реестр заказов контрагентам">
                    <FileEdit size={20} /> Реестр заказов
                </Link>
                <Link to="/invoices-registry" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700" title="Реестр счетов">
                    <Receipt size={20} /> Реестр счетов
                </Link>
                <Link to="/memo" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700" title="Служебная записка">
                    <FileText size={20} /> Служебная записка
                </Link>
                <Link to="/memos-registry" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700" title="Реестр служебных записок">
                    <FileEdit size={20} /> Реестр записок
                </Link>
            </div>
        </nav>
    );
}