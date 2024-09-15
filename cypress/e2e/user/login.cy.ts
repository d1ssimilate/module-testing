import { API_URL } from "../../support/constants"

describe("Login Function", () => {
  it("should successfully log in, display success message, and verify token presence", () => {
    cy.intercept("POST", `${API_URL}/users/auth`, (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(200)
      })
    }).as("loginRequest")

    cy.intercept("POST", `${API_URL}/users/check`, (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(200)
      })
    }).as("checkToken")

    cy.visit("/")

    cy.get("button").contains("Войти").click()
    cy.get("button").contains("Войти").click()

    cy.get(".p-dialog-mask").should("be.visible")

    cy.get(".p-dialog-mask")
      .find('input[placeholder="Почта"]')
      .type("makarovroman6284@gmail.com")

    cy.get(".p-dialog-mask").find('input[placeholder="Пароль"]').type("Qwe123")
    cy.get(".p-dialog-mask").find('button[type="submit"]').click()

    cy.wait("@loginRequest")

    cy.get(".p-dialog-mask").should("not.exist")

    cy.get("div.toast")
      .should("be.visible")
      .and("contain.text", "Вы вошли в аккаунт")

    cy.getCookie("token").should("exist")

    cy.wait("@checkToken")
  })
  it("should display error message when logging in with a non-existent user", () => {
    cy.intercept("POST", `${API_URL}/users/auth`, (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(404)
      })
    }).as("loginRequest")

    cy.visit("/")

    cy.get("button").contains("Войти").click()
    cy.get("button").contains("Войти").click()

    cy.get(".p-dialog-mask").should("be.visible")

    cy.get(".p-dialog-mask")
      .find('input[placeholder="Почта"]')
      .type("test123@gmail.com")

    cy.get(".p-dialog-mask").find('input[placeholder="Пароль"]').type("qaz123")
    cy.get(".p-dialog-mask").find('button[type="submit"]').click()

    cy.wait("@loginRequest")

    cy.get("div.toast")
      .should("be.visible")
      .and("contain.text", "Пользователь не найден")
  })
})
