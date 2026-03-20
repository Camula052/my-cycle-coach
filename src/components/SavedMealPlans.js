import React, { useState } from 'react';
import { Calendar, Trash2, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const COLORS = {
  text: '#2D3748',
  textLight: '#718096',
  background: '#FAF5F0',
  primary: '#E8A888'
};

const SavedMealPlans = ({ plans = [], onDelete = () => {} }) => {
  const { t } = useTranslation();
  const [expandedPlan, setExpandedPlan] = useState(null);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const getMealTypeLabel = (mealType) => {
    const labels = {
      breakfast: t('nutrition.recipes.categories.breakfast'),
      lunch: t('nutrition.recipes.categories.lunch'),
      dinner: t('nutrition.recipes.categories.dinner'),
      snack: t('nutrition.recipes.categories.snack')
    };
    return labels[mealType] || mealType;
  };

  const getDietBadge = (diet) => {
    const badges = {
      vegan: { label: 'Vegan', color: '#4CAF50' },
      vegetarian: { label: 'Vegetarisch', color: '#8BC34A' },
      pescetarian: { label: 'Pescetarisch', color: '#00BCD4' },
      paleo: { label: 'Paleo', color: '#FF9800' },
      keto: { label: 'Keto', color: '#9C27B0' }
    };
    return badges[diet] || null;
  };

  if (!plans || plans.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: COLORS.textLight
      }}>
        <Calendar size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '8px',
          color: COLORS.text
        }}>
          {t('nutrition.mealPlan.noPlans')}
        </h3>
        <p style={{ fontSize: '14px' }}>
          {t('nutrition.mealPlan.createFirst')}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      display: 'grid',
      gap: '16px'
    }}>
      {plans.map((plan) => {
        const isExpanded = expandedPlan === plan.id;
        const dietBadge = getDietBadge(plan.preferences?.diet);
        
        return (
          <div
            key={plan.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.3s'
            }}
          >
            {/* Header */}
            <div
              onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
              style={{
                padding: '20px',
                cursor: 'pointer',
                background: isExpanded ? '#F9F9F9' : 'white',
                transition: 'background 0.2s'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{
                      color: COLORS.text,
                      fontSize: '18px',
                      fontWeight: '700',
                      margin: 0
                    }}>
                      Meal Plan • {plan.startDay}
                    </h3>
                    {dietBadge && (
                      <span style={{
                        padding: '4px 10px',
                        background: dietBadge.color,
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {dietBadge.label}
                      </span>
                    )}
                  </div>

                  <p style={{
                    color: COLORS.textLight,
                    fontSize: '13px',
                    margin: 0
                  }}>
                    Erstellt am {formatDate(plan.createdAt)}
                  </p>

                  {/* Preferences Pills */}
                  {plan.preferences && (
                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                      marginTop: '12px'
                    }}>
                      {plan.preferences.intolerances?.map((intolerance, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '3px 8px',
                            background: 'rgba(255, 107, 107, 0.1)',
                            color: '#FF6B6B',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}
                        >
                          Keine {intolerance}
                        </span>
                      ))}
                      {plan.preferences.preferences?.map((pref, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '3px 8px',
                            background: 'rgba(232, 168, 136, 0.2)',
                            color: COLORS.primary,
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Möchtest du diesen Meal Plan wirklich löschen?')) {
                        onDelete(plan.id);
                      }
                    }}
                    style={{
                      padding: '8px',
                      background: 'white',
                      border: '2px solid #FFE0E0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FFE0E0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <Trash2 size={16} color="#FF6B6B" />
                  </button>

                  <button
                    style={{
                      padding: '8px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {isExpanded ? (
                      <ChevronUp size={20} color={COLORS.textLight} />
                    ) : (
                      <ChevronDown size={20} color={COLORS.textLight} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div style={{
                padding: '0 20px 20px',
                background: '#F9F9F9'
              }}>
                {/* Days */}
                {plan.plan?.days?.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: dayIndex < plan.plan.days.length - 1 ? '12px' : 0
                    }}
                  >
                    <h4 style={{
                      color: COLORS.text,
                      fontSize: '16px',
                      fontWeight: '700',
                      marginBottom: '12px'
                    }}>
                      {day.day}
                    </h4>

                    <div style={{ display: 'grid', gap: '8px' }}>
                      {Object.entries(day.meals || {}).map(([mealType, meal]) => (
                        <div
                          key={mealType}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px',
                            background: '#F9F9F9',
                            borderRadius: '8px'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{
                              color: COLORS.textLight,
                              fontSize: '11px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              marginBottom: '3px'
                            }}>
                              {getMealTypeLabel(mealType)}
                            </div>
                            <div style={{
                              color: COLORS.text,
                              fontSize: '14px',
                              fontWeight: '600'
                            }}>
                              {meal.name}
                            </div>
                          </div>
                          <div style={{
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                            color: COLORS.textLight,
                            fontSize: '12px'
                          }}>
                            <span>{meal.calories} kcal</span>
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <Clock size={12} />
                              {meal.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SavedMealPlans;