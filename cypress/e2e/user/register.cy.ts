import { API_URL } from "../../support/constants"

const email = (Math.random() + 1).toString(36).substring(7)

describe("Register Function", () => {
  it("should register and login a user successfully and check token", () => {
    cy.intercept("POST", `${API_URL}/users/reg`, (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(200)
      })
    }).as("registerRequest")

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

    cy.get("b").contains("Зарегистрироваться").click()

    cy.get(".p-dialog-title").should("contain.text", "Регистрация")

    cy.get(".p-dialog-mask")
      .find('input[placeholder="Почта"]')
      .type(`${email}@gmail.com`)

    cy.get(".p-dialog-mask").find('input[placeholder="Пароль"]').type("Qwe123")

    cy.get(".p-dialog-mask")
      .find('input[placeholder="Повторите пароль"]')
      .type("Qwe123")

    cy.get(".p-dialog-mask").find('button[type="submit"]').click()

    cy.wait("@registerRequest")
    cy.wait("@loginRequest")
    cy.wait("@checkToken")
  })
  it("should show error message when trying to register with an existing email", () => {
    cy.intercept("POST", `${API_URL}/users/reg`, (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(500)
      })
    }).as("registerRequest")

    cy.visit("/")

    cy.get("button").contains("Войти").click()
    cy.get("button").contains("Войти").click()

    cy.get(".p-dialog-mask").should("be.visible")

    cy.get("b").contains("Зарегистрироваться").click()

    cy.get(".p-dialog-title").should("contain.text", "Регистрация")

    cy.get(".p-dialog-mask")
      .find('input[placeholder="Почта"]')
      .type(`${email}@gmail.com`)

    cy.get(".p-dialog-mask").find('input[placeholder="Пароль"]').type("Qwe123")

    cy.get(".p-dialog-mask")
      .find('input[placeholder="Повторите пароль"]')
      .type("Qwe123")

    cy.get(".p-dialog-mask").find('button[type="submit"]').click()

    cy.wait("@registerRequest")

    cy.get("div.toast")
      .should("be.visible")
      .and(
        "contain.text",
        'повторяющееся значение ключа нарушает ограничение уникальности "users_email"'
      )
  })
})
