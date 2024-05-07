import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Vote, VoteRelations, Candidat, User} from '../models';
import {CandidatRepository} from './candidat.repository';
import {UserRepository} from './user.repository';

export class VoteRepository extends DefaultCrudRepository<
  Vote,
  typeof Vote.prototype.id,
  VoteRelations
> {

  public readonly candidat: BelongsToAccessor<Candidat, typeof Vote.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Vote.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CandidatRepository') protected candidatRepositoryGetter: Getter<CandidatRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Vote, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.candidat = this.createBelongsToAccessorFor('candidat', candidatRepositoryGetter,);
    this.registerInclusionResolver('candidat', this.candidat.inclusionResolver);
  }
}
