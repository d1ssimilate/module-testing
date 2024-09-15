import { API_URL } from "../../support/constants"

describe("Recover Function", () => {
  it("should display success message after password reset request is sent", () => {
    cy.intercept("PUT", `${API_URL}/users/passreset`, (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(200)
      })
    }).as("passresetRequest")

    cy.visit("/")

    cy.get("button").contains("Войти").click()
    cy.get("button").contains("Войти").click()

    cy.get(".p-dialog-mask").should("be.visible")

    cy.get("b").contains("Восстановить пароль").click()

    cy.get(".p-dialog-title").should("contain.text", "Восстановить пароль")

    cy.get(".p-dialog-mask")
      .find('input[placeholder="Почта"]')
      .type(`grainymarionette@gigabitz.xyz`)

    cy.get(".p-dialog-mask").find('button[type="submit"]').click()

    cy.wait("@passresetRequest")

    cy.get("div.toast")
      .should("be.visible")
      .and(
        "contain.text",
        "Письмо с ссылкой для смены пароля отправлено на вашу почту!Письмо с ссылкой для смены пароля отправлено на вашу почту!"
      )
  })
  it("should display error message for unconfirmed email during password reset", () => {
    cy.intercept("PUT", `${API_URL}/users/passreset`, (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(403)
      })
    }).as("passresetRequest")

    cy.visit("/")

    cy.get("button").contains("Войти").click()
    cy.get("button").contains("Войти").click()

    cy.get(".p-dialog-mask").should("be.visible")

    cy.get("b").contains("Восстановить пароль").click()

    cy.get(".p-dialog-title").should("contain.text", "Восстановить пароль")

    cy.get(".p-dialog-mask")
      .find('input[placeholder="Почта"]')
      .type(`makarovroman6284@gmail.com`)

    cy.get(".p-dialog-mask").find('button[type="submit"]').click()

    cy.wait("@passresetRequest")

    cy.get("div.toast")
      .should("be.visible")
      .and("contain.text", "Почта не подтверждена")
  })
  it("should display error message for non-existent user during password reset", () => {
    cy.intercept("PUT", `${API_URL}/users/passreset`, (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(404)
      })
    }).as("passresetRequest")

    cy.visit("/")

    cy.get("button").contains("Войти").click()
    cy.get("button").contains("Войти").click()

    cy.get(".p-dialog-mask").should("be.visible")

    cy.get("b").contains("Восстановить пароль").click()

    cy.get(".p-dialog-title").should("contain.text", "Восстановить пароль")

    cy.get(".p-dialog-mask")
      .find('input[placeholder="Почта"]')
      .type(`qwe123zxc!@gmail.com`)

    cy.get(".p-dialog-mask").find('button[type="submit"]').click()

    cy.wait("@passresetRequest")

    cy.get("div.toast")
      .should("be.visible")
      .and("contain.text", "Пользователь не найден")
  })
})
