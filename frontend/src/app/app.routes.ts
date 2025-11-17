import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from './gaurd/auth-gaurd-guard';

export const routes: Routes = [{
    path: '',
    redirectTo: 'ExpenseCalc',
    pathMatch: 'full',
},
{
    path: 'ExpenseCalc',
    loadComponent: () => import('./components/home-page/home-page').then((m) => m.HomePage),
    canActivate: [authGuard],
    children: [{
        path: '',
        loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
    }, {
        path: 'add-expense',
        loadComponent: () => import('./components/add-expense/add-expense').then((m) => m.AddExpense),
    }]
},
{ path: 'login', loadComponent: () => import('./components/login/login').then((m) => m.Login) },
{ path: 'signup', loadComponent: () => import('./components/sign-up/sign-up').then((m) => m.Signup) }];
