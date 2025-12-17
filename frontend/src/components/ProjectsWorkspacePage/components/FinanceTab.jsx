import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TabStyles.css';
import './FinanceTab.css';

const FinanceTab = ({ projectId, onUpdate }) => {
    const [finance, setFinance] = useState({
        totalBudget: 0,
        paymentsReceived: [],
        expenses: []
    });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(null); // 'income' or 'expense'
    const [newItem, setNewItem] = useState({ amount: '', description: '' });
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [tempBudget, setTempBudget] = useState('');

    const fetchFinance = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:1000/api/v3/projects/${projectId}/finance`);
            setFinance(response.data);
            setTempBudget(response.data.totalBudget);
        } catch (err) {
            console.error('Error fetching finance:', err);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchFinance();
    }, [fetchFinance]);

    // Calculate totals
    const totalReceived = finance.paymentsReceived.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = finance.expenses.reduce((sum, item) => sum + item.amount, 0);
    const pendingAmount = finance.totalBudget - totalReceived;
    const profit = totalReceived - totalExpenses;

    // Update Budget
    const handleUpdateBudget = async () => {
        try {
            const response = await axios.put(`http://localhost:1000/api/v3/projects/${projectId}/finance`, {
                totalBudget: parseFloat(tempBudget) || 0
            });
            setFinance(prev => ({ ...prev, totalBudget: response.data.totalBudget }));
            setIsEditingBudget(false);
            if (onUpdate) onUpdate(); // Trigger parent refresh
        } catch (err) {
            alert('Failed to update budget');
        }
    };

    // Add Transaction
    const handleAddTransaction = async (e) => {
        e.preventDefault();
        if (!newItem.amount || !newItem.description) return;

        try {
            const amount = parseFloat(newItem.amount);
            const updateField = showForm === 'income' ? 'paymentsReceived' : 'expenses';
            const newList = [...finance[updateField], {
                amount,
                description: newItem.description,
                date: new Date()
            }];

            const response = await axios.put(`http://localhost:1000/api/v3/projects/${projectId}/finance`, {
                [updateField]: newList
            });

            setFinance(response.data);
            setShowForm(null);
            setNewItem({ amount: '', description: '' });
            if (onUpdate) onUpdate(); // Trigger parent refresh
        } catch (err) {
            alert('Failed to add transaction');
        }
    };

    if (loading) return <div className="tab-loading">Loading finance data...</div>;

    return (
        <div className="finance-tab">
            <h2 className="tab-title">Project Finance Tracker</h2>

            {/* Summary Cards */}
            <div className="finance-summary">
                <div className="summary-card budget">
                    <div className="card-label">Total Budget</div>
                    {isEditingBudget ? (
                        <div className="budget-edit">
                            <input
                                type="number"
                                value={tempBudget}
                                onChange={(e) => setTempBudget(e.target.value)}
                                autoFocus
                            />
                            <button onClick={handleUpdateBudget}>✓</button>
                        </div>
                    ) : (
                        <div className="card-value" onClick={() => setIsEditingBudget(true)} title="Click to edit">
                            ${finance.totalBudget.toLocaleString()} ✎
                        </div>
                    )}
                </div>
                <div className="summary-card income">
                    <div className="card-label">Received</div>
                    <div className="card-value">${totalReceived.toLocaleString()}</div>
                </div>
                <div className="summary-card pending">
                    <div className="card-label">Pending</div>
                    <div className="card-value">${pendingAmount.toLocaleString()}</div>
                </div>
                <div className="summary-card profit">
                    <div className="card-label">Net Profit</div>
                    <div className="card-value">${profit.toLocaleString()}</div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="finance-actions">
                <button
                    className={`btn-action ${showForm === 'income' ? 'active' : ''}`}
                    onClick={() => setShowForm(showForm === 'income' ? null : 'income')}
                >
                    + Record Payment
                </button>
                <button
                    className={`btn-action expense ${showForm === 'expense' ? 'active' : ''}`}
                    onClick={() => setShowForm(showForm === 'expense' ? null : 'expense')}
                >
                    - Record Expense
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAddTransaction} className="transaction-form">
                    <h3>{showForm === 'income' ? 'Record Payment Received' : 'Record Project Expense'}</h3>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Description (e.g. Initial Deposit)"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Amount ($)"
                            value={newItem.amount}
                            onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                            required
                            min="0"
                        />
                        <button type="submit" className="btn-submit">Add</button>
                    </div>
                </form>
            )}

            {/* Transactions Lists */}
            <div className="transactions-grid">
                <div className="transactions-column">
                    <h3>Payments Received</h3>
                    <div className="transaction-list">
                        {finance.paymentsReceived.length === 0 ? (
                            <p className="empty-text">No payments recorded</p>
                        ) : (
                            finance.paymentsReceived.map((item, i) => (
                                <div key={i} className="transaction-item income">
                                    <div className="trans-info">
                                        <span className="trans-desc">{item.description}</span>
                                        <span className="trans-date">
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="trans-amount">+${item.amount.toLocaleString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="transactions-column">
                    <h3>Expenses</h3>
                    <div className="transaction-list">
                        {finance.expenses.length === 0 ? (
                            <p className="empty-text">No expenses recorded</p>
                        ) : (
                            finance.expenses.map((item, i) => (
                                <div key={i} className="transaction-item expense">
                                    <div className="trans-info">
                                        <span className="trans-desc">{item.description}</span>
                                        <span className="trans-date">
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="trans-amount">-${item.amount.toLocaleString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceTab;
