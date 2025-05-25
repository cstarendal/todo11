import { describe, it, expect } from '@jest/globals';
// Antag att det finns en CreateTaskUseCase i application-lagret
// och ett ITaskRepository interface i shared/interfaces
// (Mock/in-memory implementation används för integrationstest)

describe('Integration: Create Task', () => {
  it('ska skapa och spara en Task via application-lagret', async () => {
    // Arrange: Setup in-memory repository och use case
    // TODO: Importera och mocka repository/use case när de finns
    // const repo = new InMemoryTaskRepository();
    // const useCase = new CreateTaskUseCase(repo);

    // Act: Skapa en Task
    // const result = await useCase.execute({ title: 'Integrationstest', description: 'Testar flöde' });

    // Assert: Task ska vara sparad i repo
    // expect(repo.getAll()).toContainEqual(expect.objectContaining({ title: 'Integrationstest' }));
    expect(true).toBe(false); // Gör testet rött på ett tydligt sätt
  });
});
