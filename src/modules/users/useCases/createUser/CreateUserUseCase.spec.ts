import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

describe("create user", () => {
  let createUserUseCase: CreateUserUseCase;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able to create a new user", async () => {
    const createUser = await createUserUseCase.execute({ name: "John Doe", email: "johndoe@email.com", password: "passwd" })

    expect(createUser).toHaveProperty("id")
    expect(createUser.name).toBe("John Doe")
    expect(createUser.email).toBe("johndoe@email.com")
  })

  it("should not be able to create a user with an existent email", () => {
    expect(async () => { await createUserUseCase.execute({ name: "John Doe", email: "johndoe@email.com", password: "passwd" })
      await createUserUseCase.execute({ name: "John Doe", email: "johndoe@email.com", password: "passwd" })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
