# Aether AI - Next-Gen Agentic Intelligence Platform

A premium, interactive, and fully responsive landing page built as part of the **Web Development (Task 2)** internship track.

This project showcases a state-of-the-art landing page for **Aether AI**—a mock platform empowering software teams to orchestrate and deploy autonomous AI agents. The primary focus of this task is the implementation of an interactive navigation menu that adjusts dynamically based on user scroll and viewport actions.

## 🌟 Key Features

* **Interactive Fixed Navigation:** A navigation header (`position: fixed`) that remains visible across all sections of the landing page.
* **Scroll-Driven Styling:** The navigation bar dynamically transitions from a tall transparent header to a compact, frosted-glass header (`backdrop-filter`) with a sleek border and shadow when scrolled down past `50px`.
* **Micro-Animations & Hover Effects:** Underlines transition and slide smoothly from the center of each menu item upon hover, with distinct interactive colors.
* **Scrollspy Active Highlighting:** Uses the high-performance **Intersection Observer API** to track user scroll positions and highlight the currently active section link in the header navigation.
* **Fully Responsive Hamburger Menu:** A fluid mobile navigation drawer that slides out when the hamburger icon is toggled, disabling body scroll for better usability.
* **Theme Switching (Light/Dark):** Supports seamless toggling between a premium dark theme and a clean light theme, with user preference persisted in local storage.

---

## 🛠️ Technology Stack

* **Structure:** Semantic HTML5
* **Styling:** Vanilla CSS3 (employing CSS custom properties, grid layouts, flexbox, and custom transition bezier curves)
* **Logic:** Vanilla JavaScript (ES6+)
* **Icons:** Lucide Icons library

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/devakikowsik-star/SCT_WD_2.git
   cd SCT_WD_2
   ```

2. **Serve the project:**
   You can run any simple static server to view it. For example, using Python:
   ```bash
   python -m http.server 8000
   ```
   Or using Node's `serve`:
   ```bash
   npx serve .
   ```

3. **Open the browser:**
   Navigate to [http://localhost:8000](http://localhost:8000) (or the port specified by your server) to experience the page.