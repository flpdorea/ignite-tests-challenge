import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

describe("get balance", () => {
  let usersRepository: InMemoryUsersRepository
  let statementsRepository: InMemoryStatementsRepository
  let getBalanceUseCase: GetBalanceUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
  })

  it("should be able to get a user balance", async () => {
    const user = await usersRepository.create({ name: "John Doe",  email: "johndoe@email.com",  password: "passwd" })
    const balance = await getBalanceUseCase.execute({user_id: user.id as string})

    expect(balance).toHaveProperty("statement")
    expect(balance).toHaveProperty("balance")
  })

  it("should not be able to get a nonexistent user balance", () => {
    expect(async () => { await getBalanceUseCase.execute({user_id: "blank"}) }).rejects.toBeInstanceOf(GetBalanceError)
  })
})
