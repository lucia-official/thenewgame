// @ts-nocheck
import React from 'react';
import { ShoppingBag, Package, Warehouse, Store, Briefcase } from 'lucide-react';

export const MerchTab = ({ 
    money, merchInventory, idolMerchInventory, eventMerchInventory, pendingMerch,
    merchTiers, produceMerch, warehouse, warehouseTiers, upgradeWarehouse,
    onlineStore, upgradeOnlineStore, staff, staffTiers, hireStaff 
}) => {

    const inventoryTotal = Object.values(merchInventory).reduce((a, b) => a + b, 0) + 
                           Object.values(idolMerchInventory).reduce((a, b) => a + b, 0) +
                           Object.values(eventMerchInventory).reduce((a, b) => a + b, 0) +
                           pendingMerch.reduce((sum, item) => sum + item.amount, 0);

    const Card = ({ title, icon, children, className = '' }) => (
        <div className={`bg-white dark:bg-gray-800/60 rounded-lg p-4 flex flex-col shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
            <h3 className="text-lg font-semibold text-pink-500 dark:text-pink-300 flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-pink-300/20 pb-2">
                {icon}
                {title}
            </h3>
            <div className="flex-grow">
                {children}
            </div>
        </div>
    );

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* --- LEFT COLUMN --- */}
            <div className="md:col-span-2 space-y-4">
                <Card title="Production" icon={<Package size={20} />}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {Object.entries(merchTiers).map(([item, tiers]) => (
                            <div key={item} className="space-y-3">
                                <p className="font-bold capitalize text-center text-gray-800 dark:text-white">{item}</p>
                                <div className="flex flex-col space-y-2">
                                    {Object.entries(tiers).map(([tier, tierInfo]) => (
                                        <button
                                            key={tier}
                                            onClick={() => produceMerch(item, tier, 100)}
                                            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={money < tierInfo.cost * 100}
                                        >
                                            <span className="font-semibold text-gray-800 dark:text-gray-200">{tierInfo.name}</span>
                                            <span className="block text-xs text-gray-500 dark:text-gray-400">Produce 100 (Cost: ¥{(tierInfo.cost * 100).toLocaleString()})</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Inventory" icon={<ShoppingBag size={20} />}>
                     <p className="text-lg font-semibold text-center text-gray-800 dark:text-white mb-3">
                        Warehouse Usage: {inventoryTotal.toLocaleString()} / {warehouseTiers[warehouse.level].capacity.toLocaleString()}
                    </p>
                    <div className="space-y-2 text-sm max-h-60 overflow-y-auto pr-2">
                        {Object.entries(merchInventory).map(([key, value]) => {
                            if (value === 0) return null;
                            const [item, tier] = key.split('_');
                            return (
                                <div key={key} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-2 rounded-md">
                                    <span className="text-gray-600 dark:text-gray-300">{merchTiers[item][tier].name}</span>
                                    <span className="font-bold text-gray-900 dark:text-white text-base">{value.toLocaleString()}</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* --- RIGHT COLUMN (FACILITIES & STAFF) --- */}
            <div className="md:col-span-1 space-y-4">
                 <Card title="Facilities" icon={<Warehouse size={20} />}>
                    <div className="space-y-4">
                        <div>
                            <p className="font-bold text-gray-800 dark:text-white">Warehouse Level {warehouse.level}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Capacity: {warehouseTiers[warehouse.level].capacity.toLocaleString()}</p>
                            {warehouse.level < 5 ? (
                                <button onClick={upgradeWarehouse} className="w-full p-2 bg-blue-600 text-white rounded-md font-bold text-sm hover:bg-blue-700 transition-colors">
                                    Upgrade (Cost: ¥{warehouseTiers[warehouse.level + 1].cost.toLocaleString()})
                                </button>
                            ) : ( <p className="text-center font-bold text-green-400">Max Level</p> )}
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <p className="font-bold text-gray-800 dark:text-white">Online Store Level {onlineStore.level}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{onlineStore.level > 0 ? `Sells up to ${onlineStore.level * 50} units/item weekly` : "Not Built"}</p>
                            {onlineStore.level < 5 ? (
                                <button onClick={upgradeOnlineStore} className="w-full p-2 bg-green-600 text-white rounded-md font-bold text-sm hover:bg-green-700 transition-colors">
                                    {onlineStore.level === 0 ? 'Build' : 'Upgrade'} (Cost: ¥{(onlineStore.level === 0 ? 200000 : 100000 * Math.pow(2, onlineStore.level)).toLocaleString()})
                                </button>
                            ) : ( <p className="text-center font-bold text-green-400">Max Level</p> )}
                        </div>
                    </div>
                </Card>
                <Card title="Staff Management" icon={<Briefcase size={20} />}>
                    <div className="space-y-3">
                        <div>
                            <p className="font-bold text-gray-800 dark:text-white">Merchandise Manager</p>
                            {staff.merchManager > 0 ? (
                                <p className="text-sm text-green-400 font-semibold">{staffTiers.merchManager[staff.merchManager].name}</p>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">Not Hired</p>
                            )}
                        </div>

                        {staff.merchManager < 3 ? (
                            <div>
                                <button onClick={() => hireStaff('merchManager')} className="w-full p-2 bg-purple-600 text-white rounded-md font-bold text-sm hover:bg-purple-700 transition-colors">
                                    {staff.merchManager === 0 ? 'Hire' : 'Promote'} ({staffTiers.merchManager[staff.merchManager + 1].name})
                                    <span className="block text-xs font-normal">Cost: ¥{staffTiers.merchManager[staff.merchManager + 1].cost.toLocaleString()}</span>
                                </button>
                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 text-center">
                                    <span className="font-semibold">Next Level Effect:</span> {staffTiers.merchManager[staff.merchManager + 1].effect}
                                </p>
                            </div>
                        ) : (
                            <p className="text-center font-bold text-yellow-400">Max Level Reached</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MerchTab;
