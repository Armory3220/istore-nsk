import { useEffect, useState } from 'react';
import { Package, User as UserIcon, LogOut, Check, Save } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Order } from '../types';

export const AccountPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Состояние формы входа/регистрации
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Вкладки личного кабинета
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);

  // Поля профиля
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [address, setAddress] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) {
        await loadUserData(data.user.id);
      }
      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser.id);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (uid: string) => {
    const [profileRes, ordersRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).single(),
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false }),
    ]);

    if (profileRes.data) {
      setFirstName(profileRes.data.first_name || '');
      setLastName(profileRes.data.last_name || '');
      setPhone(profileRes.data.phone || '');
      setTelegram(profileRes.data.telegram || '');
      setAddress(profileRes.data.address || '');
    }

    if (ordersRes.data) {
      setOrders(ordersRes.data as Order[]);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if (authMode === 'register') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError('Неверный email или пароль');
    }

    setAuthLoading(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      telegram: telegram.trim(),
      address: address.trim(),
    });

    setSavingProfile(false);
    if (!error) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOrders([]);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-64 bg-[#222226] rounded-2xl animate-pulse" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-[#222226] border border-zinc-800/80 rounded-3xl p-8">
          <div className="flex bg-[#18181b] p-1 rounded-xl mb-6 border border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                authMode === 'login' ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Вход
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setAuthError('');
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                authMode === 'register'
                  ? 'bg-orange-500 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Регистрация
            </button>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {authMode === 'login' ? 'С возвращением' : 'Создать аккаунт'}
          </h1>
          <p className="text-xs text-zinc-400 mb-6">
            {authMode === 'login'
              ? 'Войдите, чтобы увидеть историю заказов и сохраненные адреса'
              : 'Зарегистрируйтесь для быстрого оформления заказов'}
          </p>

          {authError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Пароль</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer mt-2"
            >
              {authLoading
                ? 'Загрузка...'
                : authMode === 'login'
                ? 'Войти'
                : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Личный кабинет</h1>
          <p className="text-sm text-zinc-400 mt-1">{user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#222226] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-sm text-zinc-300 transition-colors cursor-pointer self-start"
        >
          <LogOut className="w-4 h-4" />
          <span>Выйти</span>
        </button>
      </div>

      <div className="flex gap-3 mb-8 border-b border-zinc-800 pb-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-orange-500 text-white'
              : 'bg-[#222226] text-zinc-300 hover:bg-zinc-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Мои заказы ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-orange-500 text-white'
              : 'bg-[#222226] text-zinc-300 hover:bg-zinc-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Мои данные</span>
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-[#222226] border border-zinc-800 rounded-2xl p-12 text-center">
              <p className="text-zinc-400">У вас пока нет оформленных заказов.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#222226] border border-zinc-800/80 rounded-2xl p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4 mb-4">
                  <div>
                    <span className="text-lg font-bold text-white">Заказ №{order.id}</span>
                    <span className="text-xs text-zinc-500 ml-3">
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-400">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-zinc-300">
                        {item.name} {item.storage ? `${item.storage} ГБ` : ''} ({item.color}) ×{' '}
                        {item.quantity}
                      </span>
                      <span className="text-zinc-200 font-medium">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-800/60 text-xs text-zinc-400">
                  <span>
                    Получение: <strong className="text-zinc-200">{order.delivery_method}</strong>
                  </span>
                  <span className="text-base font-bold text-white">
                    Итого: {order.total_price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-[#222226] border border-zinc-800/80 rounded-2xl p-6 max-w-2xl space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Имя</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Фамилия</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Телефон</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 000-00-00"
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Telegram</label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username"
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">
              Адрес доставки по умолчанию (Новосибирск)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ул. Ленина, д. 1, кв. 10"
              className="w-full bg-[#18181b] border border-zinc-800 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            {profileSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Сохранено</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{savingProfile ? 'Сохранение...' : 'Сохранить данные'}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
