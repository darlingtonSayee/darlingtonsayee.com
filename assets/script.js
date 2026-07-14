const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scrollTarget);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  const feedback = document.querySelector("[data-form-feedback]");
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    const formData = {
      name: contactForm.querySelector('[name="name"]').value,
      email: contactForm.querySelector('[name="email"]').value,
      from_name: "Darlington Sayee",
      from_email: "darlington@darlingtonsayee.com",
      reply_to: contactForm.querySelector('[name="email"]').value,
      to_email: "darlington@darlingtonsayee.com",
      interest: contactForm.querySelector('[name="interest"]').value,
      message: contactForm.querySelector('[name="message"]').value
    };

    try {
      await emailjs.send("service_c4wc9qw", "template_18rkz4d", formData);

      if (feedback) {
        feedback.textContent = "Message sent! I'll be in touch soon.";
        feedback.style.color = "green";
      }
      contactForm.reset();
    } catch (error) {
      if (feedback) {
        feedback.textContent = "Something went wrong. Please try again.";
        feedback.style.color = "red";
      }
      console.error("EmailJS error:", error);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    }
  });
}

const courseGrid = document.querySelector("[data-course-grid]");

if (courseGrid) {
  const STORAGE_KEY = "darlington_academy_courses";
  const defaultCourses = [
    {
      id: "course-1",
      title: "Bookkeeping Foundations for Small Business",
      category: "Beginner Bookkeeping",
      level: "Beginner",
      duration: "3 weeks",
      price: "$79",
      description: "Learn the bookkeeping habits, account structure, and reporting basics every founder needs to stay organized.",
      modules: [
        "Understanding business income and expenses",
        "Recording transactions correctly",
        "Reading a basic profit and loss statement"
      ]
    },
    {
      id: "course-2",
      title: "QuickBooks Made Simple",
      category: "QuickBooks Training",
      level: "Intermediate",
      duration: "4 weeks",
      price: "$119",
      description: "A practical QuickBooks training program for entrepreneurs who want to set up, track, and report with confidence.",
      modules: [
        "QuickBooks setup and chart of accounts",
        "Bank feeds and reconciliations",
        "Reports that help you make better decisions"
      ]
    },
    {
      id: "course-3",
      title: "Financial Basics for Entrepreneurs",
      category: "Financial Basics",
      level: "Beginner",
      duration: "2 weeks",
      price: "$59",
      description: "Understand cash flow, profit, budgeting, and the core finance language entrepreneurs should know.",
      modules: [
        "Profit vs cash flow",
        "Basic budgeting decisions",
        "Numbers every founder should track"
      ]
    },
    {
      id: "course-4",
      title: "Cash Flow and Reporting for Growth",
      category: "Business Finance",
      level: "Advanced",
      duration: "5 weeks",
      price: "$149",
      description: "For business owners ready to use reporting and forecasting more strategically as they grow.",
      modules: [
        "Monthly management reporting",
        "Simple forecasting models",
        "Using numbers to support decisions"
      ]
    }
  ];

  const searchInput = document.querySelector("[data-course-search]");
  const summary = document.querySelector("[data-course-summary]");
  const courseCount = document.querySelector("[data-course-count]");
  const categoryButtons = Array.from(document.querySelectorAll("[data-category]"));
  const courseForm = document.querySelector("[data-course-form]");
  const courseFeedback = document.querySelector("[data-course-feedback]");
  const aiForm = document.querySelector("[data-ai-form]");
  const aiOutput = document.querySelector("[data-ai-output]");
  const promptChips = Array.from(document.querySelectorAll("[data-ai-prompt]"));
  const quizButtons = Array.from(document.querySelectorAll("[data-quiz] button"));
  const quizFeedback = document.querySelector("[data-quiz-feedback]");
  const scenarioButton = document.querySelector("[data-scenario-button]");
  const scenarioAnswer = document.querySelector("[data-scenario-answer]");

  let activeCategory = "All";
  let activeSearch = "";

  const readCustomCourses = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const saveCustomCourses = (courses) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  };

  const getAllCourses = () => [...defaultCourses, ...readCustomCourses()];

  const renderCourses = () => {
    const allCourses = getAllCourses();
    const filtered = allCourses.filter((course) => {
      const matchesCategory = activeCategory === "All" || course.category === activeCategory;
      const haystack = `${course.title} ${course.description} ${course.category} ${course.level}`.toLowerCase();
      const matchesSearch = haystack.includes(activeSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    courseGrid.innerHTML = filtered.map((course) => `
      <article class="academy-card">
        <div class="academy-card-head">
          <div>
            <span class="tag">${course.category}</span>
            <h3>${course.title}</h3>
          </div>
          <div class="academy-price">${course.price}</div>
        </div>
        <div class="academy-meta">
          <span>${course.level}</span>
          <span>${course.duration}</span>
          <span>Darlington Academy</span>
        </div>
        <p>${course.description}</p>
        <ul class="academy-lessons">
          ${course.modules.map((module) => `<li>${module}</li>`).join("")}
        </ul>
        <div class="academy-card-actions">
          <a class="button button-sm" href="contact.html#consultation">Enroll Now</a>
          <span class="ghost-link">Course demo ready</span>
        </div>
      </article>
    `).join("");

    if (summary) {
      summary.textContent = filtered.length === allCourses.length
        ? `Showing all ${filtered.length} courses`
        : `Showing ${filtered.length} of ${allCourses.length} courses`;
    }

    if (courseCount) {
      courseCount.textContent = String(allCourses.length);
    }
  };

  renderCourses();

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      activeSearch = event.target.value.trim();
      renderCourses();
    });
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category || "All";
      categoryButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderCourses();
    });
  });

  if (courseForm) {
    courseForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(courseForm);
      const newCourse = {
        id: `custom-${Date.now()}`,
        title: String(formData.get("title") || "").trim(),
        category: String(formData.get("category") || "").trim(),
        level: String(formData.get("level") || "").trim(),
        duration: String(formData.get("duration") || "").trim(),
        price: String(formData.get("price") || "").trim(),
        description: String(formData.get("description") || "").trim(),
        modules: String(formData.get("modules") || "")
          .split(/\r?\n/)
          .map((item) => item.trim())
          .filter(Boolean)
      };

      if (!newCourse.modules.length) {
        newCourse.modules = [
          "Add your first lesson here",
          "Add your second lesson here",
          "Add your student outcome here"
        ];
      }

      const savedCourses = readCustomCourses();
      saveCustomCourses([...savedCourses, newCourse]);
      renderCourses();
      courseForm.reset();

      if (courseFeedback) {
        courseFeedback.textContent = `"${newCourse.title}" was added to your academy demo.`;
      }
    });
  }

  const generateAiReply = (prompt) => {
    const text = prompt.toLowerCase();

    if (text.includes("cash flow")) {
      return "Cash flow is the movement of money in and out of the business. A company can be profitable on paper and still struggle if cash is not arriving on time. Start by tracking when money is received, when bills are due, and how much cash is available each week.";
    }

    if (text.includes("study plan") || text.includes("7-day")) {
      return "7-day QuickBooks study plan:\nDay 1: Understand the dashboard and chart of accounts.\nDay 2: Practice recording income and expenses.\nDay 3: Learn bank feeds and transaction matching.\nDay 4: Review reconciliations.\nDay 5: Explore key reports.\nDay 6: Practice fixing categorization mistakes.\nDay 7: Rebuild the full workflow from start to finish.";
    }

    if (text.includes("quiz")) {
      return "Quick quiz:\n1. Which report shows profit over a period?\n2. Why does reconciliation matter?\n3. What is the difference between cash flow and profit?\nTry answering these before checking your notes.";
    }

    if (text.includes("quickbooks")) {
      return "For QuickBooks, focus on three things first: correct setup, consistent transaction categorization, and reliable monthly reconciliation. Once those are stable, reports become much more useful.";
    }

    if (text.includes("bookkeeping")) {
      return "Bookkeeping is about keeping financial records accurate, current, and usable. The easiest way to learn it is to practice the monthly flow: record transactions, reconcile accounts, review reports, and correct mistakes early.";
    }

    return "Darlington AI Coach suggests starting with your goal first: do you want to understand bookkeeping, use QuickBooks better, or improve business decisions from your numbers? Once that is clear, we can build a simpler study path around it.";
  };

  if (aiForm && aiOutput) {
    aiForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = aiForm.querySelector('[name="prompt"]');
      const prompt = input.value.trim();
      if (!prompt) {
        return;
      }
      aiOutput.textContent = generateAiReply(prompt);
      aiForm.reset();
    });
  }

  promptChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      if (aiOutput) {
        aiOutput.textContent = generateAiReply(chip.dataset.aiPrompt || "");
      }
    });
  });

  quizButtons.forEach((button) => {
    button.addEventListener("click", () => {
      quizButtons.forEach((item) => {
        item.classList.remove("is-correct", "is-wrong");
      });

      const correct = button.dataset.answer === "correct";
      button.classList.add(correct ? "is-correct" : "is-wrong");

      if (quizFeedback) {
        quizFeedback.textContent = correct
          ? "Correct. The profit and loss statement is the main report for seeing whether the business earned profit over a period."
          : "Not quite. Try again by thinking about which report measures income minus expenses over time.";
      }
    });
  });

  if (scenarioButton && scenarioAnswer) {
    scenarioButton.addEventListener("click", () => {
      scenarioAnswer.hidden = false;
    });
  }
}

const financeApp = document.querySelector("[data-finance-app]");

if (financeApp) {
  const STORAGE_KEY = "darlington_money_planner_v1";
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });
  const fullCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  });
  const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  });
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  });
  const today = new Date();
  const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const todayString = today.toISOString().slice(0, 10);

  const settingsForm = financeApp.querySelector("[data-settings-form]");
  const transactionForm = financeApp.querySelector("[data-transaction-form]");
  const budgetForm = financeApp.querySelector("[data-budget-form]");
  const goalForm = financeApp.querySelector("[data-goal-form]");
  const monthLabels = Array.from(document.querySelectorAll("[data-finance-month-label]"));
  const feedback = financeApp.querySelector("[data-finance-feedback]");
  const budgetList = financeApp.querySelector("[data-budget-list]");
  const transactionList = financeApp.querySelector("[data-transaction-list]");
  const goalList = financeApp.querySelector("[data-goal-list]");
  const spendingChart = financeApp.querySelector("[data-spending-chart]");
  const insightList = financeApp.querySelector("[data-insight-list]");
  const budgetSummary = financeApp.querySelector("[data-budget-summary]");

  const formatMoney = (amount) => currency.format(Number.isFinite(amount) ? amount : 0);
  const formatPreciseMoney = (amount) => fullCurrency.format(Number.isFinite(amount) ? amount : 0);
  const safeNumber = (value) => {
    const parsed = Number.parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const formatMonth = (value) => monthFormatter.format(new Date(`${value}-01T12:00:00`));

  const monthDate = (day) => {
    const maxDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return new Date(today.getFullYear(), today.getMonth(), Math.min(day, maxDay))
      .toISOString()
      .slice(0, 10);
  };

  const blankState = () => ({
    startingBalance: 0,
    budgets: [],
    goals: [],
    transactions: []
  });

  const starterState = () => ({
    startingBalance: 2800,
    budgets: [
      { id: "budget-housing", category: "Housing", limit: 1300 },
      { id: "budget-groceries", category: "Groceries", limit: 400 },
      { id: "budget-transport", category: "Transport", limit: 180 },
      { id: "budget-utilities", category: "Utilities", limit: 160 },
      { id: "budget-entertainment", category: "Entertainment", limit: 150 },
      { id: "budget-health", category: "Health", limit: 120 }
    ],
    goals: [
      {
        id: "goal-emergency",
        title: "Emergency fund",
        target: 4000,
        current: 1500,
        targetDate: `${today.getFullYear()}-09-30`
      },
      {
        id: "goal-vacation",
        title: "Vacation",
        target: 1800,
        current: 650,
        targetDate: `${today.getFullYear()}-08-15`
      }
    ],
    transactions: [
      { id: "tx-salary", type: "income", amount: 3400, category: "Salary", note: "Monthly salary", date: monthDate(1) },
      { id: "tx-rent", type: "expense", amount: 1200, category: "Housing", note: "Rent", date: monthDate(2) },
      { id: "tx-freelance", type: "income", amount: 620, category: "Freelance", note: "Project payout", date: monthDate(10) },
      { id: "tx-groceries", type: "expense", amount: 265, category: "Groceries", note: "Weekly food shops", date: monthDate(12) },
      { id: "tx-transport", type: "expense", amount: 118, category: "Transport", note: "Fuel and rides", date: monthDate(14) },
      { id: "tx-utilities", type: "expense", amount: 142, category: "Utilities", note: "Power and internet", date: monthDate(16) },
      { id: "tx-health", type: "expense", amount: 84, category: "Health", note: "Pharmacy", date: monthDate(18) },
      { id: "tx-fun", type: "expense", amount: 96, category: "Entertainment", note: "Dinner out", date: monthDate(21) }
    ]
  });

  const normalizeState = (state) => ({
    startingBalance: safeNumber(state?.startingBalance),
    budgets: Array.isArray(state?.budgets)
      ? state.budgets.map((budget, index) => ({
          id: budget.id || `budget-${index}`,
          category: String(budget.category || "Other"),
          limit: safeNumber(budget.limit)
        })).filter((budget) => budget.limit > 0)
      : [],
    goals: Array.isArray(state?.goals)
      ? state.goals.map((goal, index) => ({
          id: goal.id || `goal-${index}`,
          title: String(goal.title || "Savings goal"),
          target: Math.max(0, safeNumber(goal.target)),
          current: Math.max(0, safeNumber(goal.current)),
          targetDate: String(goal.targetDate || "")
        })).filter((goal) => goal.target > 0)
      : [],
    transactions: Array.isArray(state?.transactions)
      ? state.transactions.map((transaction, index) => ({
          id: transaction.id || `tx-${index}`,
          type: transaction.type === "income" ? "income" : "expense",
          amount: Math.max(0, safeNumber(transaction.amount)),
          category: String(transaction.category || "Other"),
          note: String(transaction.note || ""),
          date: String(transaction.date || todayString)
        })).filter((transaction) => transaction.amount > 0)
      : []
  });

  const readState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return normalizeState(saved ? JSON.parse(saved) : starterState());
    } catch {
      return normalizeState(starterState());
    }
  };

  const saveState = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(financeState));
  };

  const setFeedback = (message, tone = "success") => {
    if (!feedback) {
      return;
    }

    feedback.textContent = message;
    feedback.style.color = tone === "error" ? "#a14634" : "#2c6c58";
  };

  const totalsByCategory = (transactions) => transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== "expense") {
      return accumulator;
    }

    accumulator[transaction.category] = (accumulator[transaction.category] || 0) + transaction.amount;
    return accumulator;
  }, {});

  const getMetrics = (state) => {
    const transactions = [...state.transactions].sort((a, b) => b.date.localeCompare(a.date));
    const monthTransactions = transactions.filter((transaction) => transaction.date.startsWith(monthKey));
    const monthIncome = monthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const monthExpenses = monthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const cashBalance = state.startingBalance + totalIncome - totalExpenses;
    const monthNet = monthIncome - monthExpenses;
    const savingsRate = monthIncome > 0 ? Math.max(0, Math.round((monthNet / monthIncome) * 100)) : 0;
    const expenseByCategory = totalsByCategory(monthTransactions);
    const budgets = state.budgets.map((budget) => {
      const spent = expenseByCategory[budget.category] || 0;
      const progress = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0;
      const remaining = budget.limit - spent;
      return {
        ...budget,
        spent,
        remaining,
        progress,
        status: spent > budget.limit ? "danger" : spent >= budget.limit * 0.8 ? "warning" : "healthy"
      };
    });
    const overBudget = budgets.filter((budget) => budget.status === "danger");
    const closeToLimit = budgets.filter((budget) => budget.status === "warning");
    const rankedCategories = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
    const topCategory = rankedCategories[0] || null;

    return {
      transactions,
      monthTransactions,
      monthIncome,
      monthExpenses,
      cashBalance,
      monthNet,
      savingsRate,
      budgets,
      overBudget,
      closeToLimit,
      rankedCategories,
      topCategory
    };
  };

  const renderMetrics = (metrics) => {
    const setText = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = value;
      }
    };

    monthLabels.forEach((label) => {
      label.textContent = formatMonth(monthKey);
    });

    setText("[data-cash-balance]", formatMoney(metrics.cashBalance));
    setText("[data-month-income]", formatMoney(metrics.monthIncome));
    setText("[data-month-expenses]", formatMoney(metrics.monthExpenses));
    setText("[data-savings-rate]", `${metrics.savingsRate}%`);
    setText("[data-month-net]", formatMoney(metrics.monthNet));
    setText("[data-hero-cash-balance]", formatMoney(metrics.cashBalance));
    setText("[data-hero-month-net]", formatMoney(metrics.monthNet));
    setText("[data-hero-savings-rate]", `${metrics.savingsRate}%`);

    const budgetHealthText = !metrics.budgets.length
      ? "No budgets yet"
      : metrics.overBudget.length
        ? "Needs attention"
        : metrics.closeToLimit.length
          ? "Watchlist"
          : "On track";

    setText("[data-budget-health]", budgetHealthText);
    setText("[data-hero-budget-health]", budgetHealthText);

    const budgetHealthDetail = document.querySelector("[data-budget-health-detail]");
    if (budgetHealthDetail) {
      budgetHealthDetail.textContent = !metrics.budgets.length
        ? "Add budgets to compare your limits against your spending."
        : metrics.overBudget.length
          ? `${metrics.overBudget.length} categor${metrics.overBudget.length === 1 ? "y is" : "ies are"} over budget right now.`
          : metrics.closeToLimit.length
            ? `${metrics.closeToLimit.length} categor${metrics.closeToLimit.length === 1 ? "y is" : "ies are"} close to the limit.`
            : "All budgeted categories are comfortably within their limits.";
    }

    const monthNetDetail = document.querySelector("[data-month-net-detail]");
    if (monthNetDetail) {
      monthNetDetail.textContent = metrics.monthNet >= 0
        ? `You kept ${formatMoney(metrics.monthNet)} after spending this month.`
        : `You spent ${formatMoney(Math.abs(metrics.monthNet))} more than you earned this month.`;
    }

    const topCategory = document.querySelector("[data-top-category]");
    const topCategoryDetail = document.querySelector("[data-top-category-detail]");
    if (topCategory && topCategoryDetail) {
      if (!metrics.topCategory) {
        topCategory.textContent = "None yet";
        topCategoryDetail.textContent = "Log a few expenses to see where most of your money is going.";
      } else {
        topCategory.textContent = `${metrics.topCategory[0]} ${formatMoney(metrics.topCategory[1])}`;
        topCategoryDetail.textContent = `${metrics.topCategory[0]} is your largest expense category for ${formatMonth(monthKey)}.`;
      }
    }

    if (settingsForm) {
      const input = settingsForm.querySelector('[name="startingBalance"]');
      if (input) {
        input.value = financeState.startingBalance ? financeState.startingBalance.toFixed(2) : "";
      }
    }
  };

  const renderBudgets = (metrics) => {
    if (!budgetList || !budgetSummary) {
      return;
    }

    if (!metrics.budgets.length) {
      budgetSummary.textContent = "Set a few category limits to start watching your monthly spending rhythm.";
      budgetList.innerHTML = '<div class="finance-empty-state">No budgets yet. Add one from the planner above to start tracking your categories.</div>';
      return;
    }

    budgetSummary.textContent = metrics.overBudget.length
      ? `${metrics.overBudget.length} category budget${metrics.overBudget.length === 1 ? " is" : "s are"} over the limit.`
      : "Your budget board is active and updating from this month's expenses.";

    budgetList.innerHTML = metrics.budgets.map((budget) => {
      const pillClass = budget.status === "danger"
        ? "finance-budget-pill is-danger"
        : budget.status === "warning"
          ? "finance-budget-pill is-warning"
          : "finance-budget-pill";
      const fillClass = budget.status === "danger"
        ? "finance-progress-fill is-danger"
        : budget.status === "warning"
          ? "finance-progress-fill is-warning"
          : "finance-progress-fill";
      const label = budget.status === "danger"
        ? "Over budget"
        : budget.status === "warning"
          ? "Close to limit"
          : "Healthy";

      return `
        <article class="finance-budget-card">
          <div class="finance-budget-head">
            <div>
              <div class="finance-budget-topline">
                <strong>${budget.category}</strong>
                <span class="${pillClass}">${label}</span>
              </div>
              <div class="finance-budget-meta">
                <span>Spent ${formatMoney(budget.spent)}</span>
                <span>Limit ${formatMoney(budget.limit)}</span>
                <span>${budget.remaining >= 0 ? `${formatMoney(budget.remaining)} left` : `${formatMoney(Math.abs(budget.remaining))} over`}</span>
              </div>
            </div>
            <button class="finance-icon-button" type="button" data-delete-budget="${budget.id}">Delete</button>
          </div>
          <div class="finance-progress-track" aria-hidden="true">
            <div class="${fillClass}" style="width: ${Math.min(budget.progress, 100)}%"></div>
          </div>
        </article>
      `;
    }).join("");
  };

  const renderTransactions = (metrics) => {
    if (!transactionList) {
      return;
    }

    if (!metrics.transactions.length) {
      transactionList.innerHTML = '<div class="finance-empty-state">No transactions yet. Add your first income or expense from the planner.</div>';
      return;
    }

    transactionList.innerHTML = metrics.transactions.slice(0, 8).map((transaction) => `
      <article class="finance-transaction-item">
        <div class="finance-transaction-row">
          <div class="finance-transaction-main">
            <strong>${transaction.note || transaction.category}</strong>
            <div class="finance-transaction-meta">
              <span>${transaction.category}</span>
              <span>${dateFormatter.format(new Date(`${transaction.date}T12:00:00`))}</span>
              <span>${transaction.type === "income" ? "Income" : "Expense"}</span>
            </div>
          </div>
          <div class="finance-transaction-main">
            <strong class="finance-transaction-amount ${transaction.type === "income" ? "is-income" : "is-expense"}">
              ${transaction.type === "income" ? "+" : "-"}${formatPreciseMoney(transaction.amount)}
            </strong>
            <button class="finance-icon-button" type="button" data-delete-transaction="${transaction.id}">Delete</button>
          </div>
        </div>
      </article>
    `).join("");
  };

  const renderGoals = () => {
    if (!goalList) {
      return;
    }

    if (!financeState.goals.length) {
      goalList.innerHTML = '<div class="finance-empty-state">No savings goals yet. Create one above to start building progress.</div>';
      return;
    }

    goalList.innerHTML = financeState.goals.map((goal) => {
      const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
      return `
        <article class="finance-goal-card">
          <div class="finance-goal-row">
            <div class="finance-goal-main">
              <div class="finance-goal-topline">
                <strong>${goal.title}</strong>
                <span class="finance-budget-pill">${Math.round(progress)}%</span>
              </div>
              <div class="finance-goal-meta">
                <span>${formatMoney(goal.current)} saved</span>
                <span>Target ${formatMoney(goal.target)}</span>
                <span>${goal.targetDate ? `Due ${goal.targetDate}` : "No deadline"}</span>
              </div>
            </div>
            <button class="finance-icon-button" type="button" data-delete-goal="${goal.id}">Delete</button>
          </div>
          <div class="finance-progress-track" aria-hidden="true">
            <div class="finance-progress-fill" style="width: ${progress}%"></div>
          </div>
          <form class="finance-goal-topup" data-goal-topup-form="${goal.id}">
            <label>
              Add progress
              <input type="number" name="amount" min="0.01" step="0.01" placeholder="50" required>
            </label>
            <button class="button button-sm" type="submit">Add</button>
          </form>
        </article>
      `;
    }).join("");
  };

  const renderInsights = (metrics) => {
    if (!spendingChart || !insightList) {
      return;
    }

    if (!metrics.rankedCategories.length) {
      spendingChart.innerHTML = '<div class="finance-empty-state">No expense categories to chart yet. Add some spending to see your breakdown.</div>';
    } else {
      const topAmount = metrics.rankedCategories[0][1];
      spendingChart.innerHTML = metrics.rankedCategories.slice(0, 6).map(([category, amount]) => `
        <div class="finance-chart-row">
          <div class="finance-chart-label">
            <span>${category}</span>
            <strong>${formatMoney(amount)}</strong>
          </div>
          <div class="finance-chart-bar" aria-hidden="true">
            <span style="width: ${(amount / topAmount) * 100}%"></span>
          </div>
        </div>
      `).join("");
    }

    const insights = [];
    const dayOfMonth = Math.max(1, today.getDate());
    const averageDailySpend = metrics.monthExpenses / dayOfMonth;
    const nearestGoal = [...financeState.goals]
      .sort((a, b) => (a.target - a.current) - (b.target - b.current))[0];

    if (!metrics.monthTransactions.length) {
      insights.push("Start by setting a starting balance and logging this month's income plus your largest recurring bills.");
      insights.push("Add 3 to 5 category budgets so the planner can show whether your spending is healthy or drifting.");
    } else {
      if (metrics.monthNet < 0) {
        insights.push(`This month is running negative by ${formatMoney(Math.abs(metrics.monthNet))}. Trim the largest expense category first.`);
      } else {
        insights.push(`You are currently positive by ${formatMoney(metrics.monthNet)} this month. Consider moving part of that into a savings goal.`);
      }

      if (metrics.topCategory) {
        insights.push(`${metrics.topCategory[0]} is your biggest expense bucket at ${formatMoney(metrics.topCategory[1])} for ${formatMonth(monthKey)}.`);
      }

      if (metrics.overBudget.length) {
        insights.push(`Over budget: ${metrics.overBudget.map((budget) => budget.category).join(", ")}.`);
      } else if (metrics.closeToLimit.length) {
        insights.push(`Close to the limit: ${metrics.closeToLimit.map((budget) => budget.category).join(", ")}.`);
      }

      insights.push(`Average daily spending is ${formatMoney(averageDailySpend)} so far this month.`);
    }

    if (nearestGoal) {
      const remaining = Math.max(nearestGoal.target - nearestGoal.current, 0);
      insights.push(`${nearestGoal.title} needs ${formatMoney(remaining)} more to reach its target.`);
    } else {
      insights.push("Add a savings goal to turn spare cash flow into a concrete next milestone.");
    }

    insightList.innerHTML = insights.slice(0, 4).map((item) => `<li>${item}</li>`).join("");
  };

  const renderFinanceApp = () => {
    const metrics = getMetrics(financeState);
    renderMetrics(metrics);
    renderBudgets(metrics);
    renderTransactions(metrics);
    renderGoals();
    renderInsights(metrics);
  };

  let financeState = readState();

  if (transactionForm) {
    const dateInput = transactionForm.querySelector('[name="date"]');
    if (dateInput) {
      dateInput.value = todayString;
    }
  }

  settingsForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(settingsForm);
    financeState.startingBalance = Math.max(0, safeNumber(formData.get("startingBalance")));
    saveState();
    renderFinanceApp();
    setFeedback("Starting balance updated.");
  });

  transactionForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(transactionForm);
    const transaction = {
      id: makeId("tx"),
      type: String(formData.get("type") || "expense"),
      amount: Math.max(0, safeNumber(formData.get("amount"))),
      category: String(formData.get("category") || "Other"),
      note: String(formData.get("note") || "").trim(),
      date: String(formData.get("date") || todayString)
    };

    if (!transaction.amount) {
      setFeedback("Enter a valid transaction amount.", "error");
      return;
    }

    financeState.transactions = [transaction, ...financeState.transactions];
    saveState();
    renderFinanceApp();
    transactionForm.reset();
    const dateInput = transactionForm.querySelector('[name="date"]');
    if (dateInput) {
      dateInput.value = todayString;
    }
    setFeedback("Transaction logged.");
  });

  budgetForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(budgetForm);
    const category = String(formData.get("category") || "Other");
    const limit = Math.max(0, safeNumber(formData.get("limit")));

    if (!limit) {
      setFeedback("Enter a valid budget limit.", "error");
      return;
    }

    const existing = financeState.budgets.find((budget) => budget.category === category);
    if (existing) {
      existing.limit = limit;
    } else {
      financeState.budgets = [...financeState.budgets, { id: makeId("budget"), category, limit }];
    }

    saveState();
    renderFinanceApp();
    budgetForm.reset();
    setFeedback(`Budget saved for ${category}.`);
  });

  goalForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(goalForm);
    const title = String(formData.get("title") || "").trim();
    const target = Math.max(0, safeNumber(formData.get("target")));
    const current = Math.max(0, safeNumber(formData.get("saved")));
    const targetDate = String(formData.get("targetDate") || "");

    if (!title || !target) {
      setFeedback("Add a goal name and target amount.", "error");
      return;
    }

    financeState.goals = [
      { id: makeId("goal"), title, target, current, targetDate },
      ...financeState.goals
    ];
    saveState();
    renderFinanceApp();
    goalForm.reset();
    setFeedback(`Goal created for ${title}.`);
  });

  financeApp.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.matches("[data-finance-load-demo]")) {
      financeState = normalizeState(starterState());
      saveState();
      renderFinanceApp();
      setFeedback("Starter data loaded.");
      return;
    }

    if (target.matches("[data-finance-reset]")) {
      financeState = blankState();
      saveState();
      renderFinanceApp();
      setFeedback("App reset. You now have a clean slate.");
      return;
    }

    const budgetId = target.getAttribute("data-delete-budget");
    if (budgetId) {
      financeState.budgets = financeState.budgets.filter((budget) => budget.id !== budgetId);
      saveState();
      renderFinanceApp();
      setFeedback("Budget removed.");
      return;
    }

    const transactionId = target.getAttribute("data-delete-transaction");
    if (transactionId) {
      financeState.transactions = financeState.transactions.filter((transaction) => transaction.id !== transactionId);
      saveState();
      renderFinanceApp();
      setFeedback("Transaction removed.");
      return;
    }

    const goalId = target.getAttribute("data-delete-goal");
    if (goalId) {
      financeState.goals = financeState.goals.filter((goal) => goal.id !== goalId);
      saveState();
      renderFinanceApp();
      setFeedback("Goal removed.");
    }
  });

  financeApp.addEventListener("submit", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLFormElement)) {
      return;
    }

    const goalId = target.getAttribute("data-goal-topup-form");
    if (!goalId) {
      return;
    }

    event.preventDefault();
    const formData = new FormData(target);
    const amount = Math.max(0, safeNumber(formData.get("amount")));

    if (!amount) {
      setFeedback("Enter a valid amount to add to the goal.", "error");
      return;
    }

    financeState.goals = financeState.goals.map((goal) => goal.id === goalId
      ? { ...goal, current: goal.current + amount }
      : goal);
    saveState();
    renderFinanceApp();
    setFeedback("Goal progress updated.");
  });

  renderFinanceApp();
}
