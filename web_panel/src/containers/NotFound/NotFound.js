import React from 'react';

export default function NotFound() {
  return (
    <div className="abs-center wd-xl">
      <div className="text-center mb-xl">
        <div className="text-lg mb-lg">404</div>
        <p className="lead m0">Мы не смогли найти эту страницу.</p>
        <p>Страница, которую вы ищете, не существует.</p>
      </div>
      <ul className="list-inline text-center text-sm mb-xl">
        <li>
          <a href="/" className="text-muted">Главная страница</a>
        </li>
        <li className="text-muted">|</li>
        <li>
          <a href="/login" className="text-muted">Войдите</a>
        </li>
      </ul>
    </div>
  );
}
