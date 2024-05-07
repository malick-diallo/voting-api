import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {User, Vote} from '../models';
import {CandidatRepository, UserRepository, VoteRepository} from '../repositories';

export class VoteController {
  constructor(
    @repository(VoteRepository)
    public voteRepository: VoteRepository,
    @repository(CandidatRepository)
    public candidatRepository: CandidatRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }


  @post('/vote/{candidatId}')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async vote(
    @param.path.string('candidatId') candidatId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'Vote',
          }),
        },
      },
    })
    user: User,
  ): Promise<boolean> {
    return this.voteFunction(user, candidatId)
  }

  voteFunction(user: User, candidatId: string) {
    if (!user.isVote) {
      this.voteRepository.create({userId: user.id, candidatId: candidatId}).then(_ => {
        this.userRepository.updateById(user.id, {...user, isVote: true})
        return true
      })
    }
    return false

  }

  @post('/votes')
  @response(200, {
    description: 'Vote model instance',
    content: {'application/json': {schema: getModelSchemaRef(Vote)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vote, {
            title: 'NewVote',
            exclude: ['id'],
          }),
        },
      },
    })
    vote: Omit<Vote, 'id'>,
  ): Promise<Vote> {
    return this.voteRepository.create(vote);
  }

  @get('/votes/count')
  @response(200, {
    description: 'Vote model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Vote) where?: Where<Vote>,
  ): Promise<Count> {
    return this.voteRepository.count(where);
  }

  @get('/votes')
  @response(200, {
    description: 'Array of Vote model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Vote, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Vote) filter?: Filter<Vote>,
  ): Promise<Vote[]> {
    return this.voteRepository.find(filter);
  }

  @patch('/votes')
  @response(200, {
    description: 'Vote PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vote, {partial: true}),
        },
      },
    })
    vote: Vote,
    @param.where(Vote) where?: Where<Vote>,
  ): Promise<Count> {
    return this.voteRepository.updateAll(vote, where);
  }

  @get('/votes/{id}')
  @response(200, {
    description: 'Vote model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Vote, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Vote, {exclude: 'where'}) filter?: FilterExcludingWhere<Vote>
  ): Promise<Vote> {
    return this.voteRepository.findById(id, filter);
  }

  @patch('/votes/{id}')
  @response(204, {
    description: 'Vote PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vote, {partial: true}),
        },
      },
    })
    vote: Vote,
  ): Promise<void> {
    await this.voteRepository.updateById(id, vote);
  }

  @put('/votes/{id}')
  @response(204, {
    description: 'Vote PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() vote: Vote,
  ): Promise<void> {
    await this.voteRepository.replaceById(id, vote);
  }

  @del('/votes/{id}')
  @response(204, {
    description: 'Vote DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.voteRepository.deleteById(id);
  }
}
