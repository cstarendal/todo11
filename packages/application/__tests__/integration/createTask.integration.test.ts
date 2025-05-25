import { describe, it, expect } from '@jest/globals';
import { InMemoryTaskRepository } from '../../../shared/src/interfaces/ITaskRepository';
import { CreateTaskUseCase } from '../../src/CreateTaskUseCase';

describe('Integration: Create Task', () => {
  it('ska skapa och spara en Task via application-lagret', async () => {
    // Arrange: Setup in-memory repository och use case
    const repo = new InMemoryTaskRepository();
    const useCase = new CreateTaskUseCase(repo);

    // Act: Skapa en Task
    const result = await useCase.execute({ title: 'Integrationstest', description: 'Testar flöde' });

    // Assert: Task ska vara sparad i repo
    const allTasks = await repo.getAll();
    expect(allTasks).toContainEqual(expect.objectContaining({ title: 'Integrationstest', description: 'Testar flöde' }));
  });
});
