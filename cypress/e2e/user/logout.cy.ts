import { API_URL } from "../../support/constants"

describe("Logout Function", () => {
  it("should log in successfully, show success message, and log out", () => {
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

    cy.visit("/profile")

    cy.get("button").contains("Выйти из аккаунта").click()

    cy.getCookie("token").should("not.exist")

    cy.url().should("eq", `http://localhost:3000/ru`)
  })
})
