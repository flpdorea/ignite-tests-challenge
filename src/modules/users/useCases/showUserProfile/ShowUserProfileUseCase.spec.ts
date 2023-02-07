import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

describe("show user profile", () => {
  let showUserProfileUseCase: ShowUserProfileUseCase
  let createUserUseCase: CreateUserUseCase
  let usersRepository: InMemoryUsersRepository

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able te return a user profile", async () => {
    const user = await createUserUseCase.execute({ name: "John Doe", email: "johndoe@email.com", password: "passwd" })
    const userProfile = await showUserProfileUseCase.execute(user.id as string)

    expect(userProfile).toHaveProperty("id")
    expect(userProfile).toEqual(user)
  })

  it("should not be able to show profile of a nonexistent user", () => {
    expect(async () => { await showUserProfileUseCase.execute("nonexistentId") }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
