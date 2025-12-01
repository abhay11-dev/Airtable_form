export function shouldShowQuestion(rules, answersSoFar) {
  if (!rules || !rules.conditions || rules.conditions.length === 0) {
    return true;
  }

  const evaluateCondition = (condition) => {
    const { questionKey, operator, value } = condition;
    const answer = answersSoFar[questionKey];

    if (answer === undefined || answer === null) {
      return false;
    }

    switch (operator) {
      case 'equals':
        if (Array.isArray(answer)) {
          return answer.includes(value);
        }
        return answer === value;

      case 'notEquals':
        if (Array.isArray(answer)) {
          return !answer.includes(value);
        }
        return answer !== value;

      case 'contains':
        if (typeof answer === 'string') {
          return answer.toLowerCase().includes(String(value).toLowerCase());
        }
        if (Array.isArray(answer)) {
          return answer.some(item => 
            String(item).toLowerCase().includes(String(value).toLowerCase())
          );
        }
        return false;

      default:
        return false;
    }
  };

  const results = rules.conditions.map(evaluateCondition);

  if (rules.logic === 'OR') {
    return results.some(result => result === true);
  }

  return results.every(result => result === true);
}

export function getVisibleQuestions(questions, answers) {
  return questions.filter(question => 
    shouldShowQuestion(question.conditionalRules, answers)
  );
}

export function validateFormResponses(questions, answers) {
  const errors = [];
  const visibleQuestions = getVisibleQuestions(questions, answers);

  for (const question of visibleQuestions) {
    const answer = answers[question.questionKey];

    if (question.required && (answer === undefined || answer === null || answer === '')) {
      errors.push({
        field: question.questionKey,
        message: `${question.label} is required`
      });
      continue;
    }

    if (answer !== undefined && answer !== null && answer !== '') {
      if (question.type === 'select' && question.options.length > 0) {
        if (!question.options.includes(answer)) {
          errors.push({
            field: question.questionKey,
            message: `Invalid option for ${question.label}`
          });
        }
      }

      if (question.type === 'multiselect' && question.options.length > 0) {
        if (!Array.isArray(answer)) {
          errors.push({
            field: question.questionKey,
            message: `${question.label} must be an array`
          });
        } else {
          const invalidOptions = answer.filter(opt => !question.options.includes(opt));
          if (invalidOptions.length > 0) {
            errors.push({
              field: question.questionKey,
              message: `Invalid options for ${question.label}: ${invalidOptions.join(', ')}`
            });
          }
        }
      }
    }
  }

  return errors;
}