import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

describe("Authenticate User Use Case", () => {
  let authenticateUserUseCase: AuthenticateUserUseCase
  let createUserUseCase: CreateUserUseCase
  let usersRepository: InMemoryUsersRepository

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able to authenticate a existent user", async () => {
    const user = { name: "John Doe", email: "johndoe@email.com", password: "passwd" }

    const createUser = await createUserUseCase.execute(user)
    const authenticateUser = await authenticateUserUseCase.execute({ email: user.email, password: user.password })

    expect(authenticateUser).toHaveProperty("token")
    expect(authenticateUser.user.id).toBe(createUser.id)
  })

  it("should not be able to authenticate a user with an incorrect password", () => {
    expect(async () => {
      const user = { name: "John Doe", email: "johndoe@email.com", password: "passwd" }
      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({ email: user.email, password: "blank" })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to authenticate a nonexistent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({ email: "blank@email.com", password: "blank" })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
