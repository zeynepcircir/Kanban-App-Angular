import { Injectable } from '@angular/core'
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'

export const BOARDS_TABLE = 'boards'
export const USER_BOARDS_TABLE = 'user_boards'
export const LISTS_TABLE = 'lists'
export const CARDS_TABLE = 'cards'
export const USERS_TABLE = 'users'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  async startBoard() {
    // Minimal return will be the default in the next version and can be removed here!
    return await this.supabase.from(BOARDS_TABLE).insert({})
  }

  async getBoards() {
    const boards = await this.supabase.from(USER_BOARDS_TABLE).select(`
    boards:board_id ( title, id )
  `)
    return boards.data || []
  }

  // CRUD Board
  async getBoardInfo(boardId: string) {
    return await this.supabase
      .from(BOARDS_TABLE)
      .select('*')
      .match({ id: boardId })
      .single();
  }

  async updateBoard(board: any) {
    return await this.supabase
      .from(BOARDS_TABLE)
      .update(board)
      .match({ id: board.id });
  }

  async deleteBoard(board: any) {
    return await this.supabase
      .from(BOARDS_TABLE)
      .delete()
      .match({ id: board.id });
  }

  // CRUD Lists
  async getBoardLists(boardId: string) {
    const lists = await this.supabase
      .from(LISTS_TABLE)
      .select('*')
      .eq('board_id', boardId)
      .order('position');

    return lists.data || [];
  }

  async addBoardList(boardId: string, position = 0) {
    return await this.supabase
      .from(LISTS_TABLE)
      .insert({ board_id: boardId, position, title: 'New List' })
      .select('*')
      .single();
  }

  async updateBoardList(list: any) {
    return await this.supabase
      .from(LISTS_TABLE)
      .update(list)
      .match({ id: list.id });
  }

  async deleteBoardList(list: any) {
    return await this.supabase
      .from(LISTS_TABLE)
      .delete()
      .match({ id: list.id });
  }

  // CRUD Cards
  async addListCard(listId: string, boardId: string, position = 0) {
    return await this.supabase
      .from(CARDS_TABLE)
      .insert(
        { board_id: boardId, list_id: listId, position }
      )
      .select('*')
      .single();
  }

  async getListCards(listId: string) {
    const lists = await this.supabase
      .from(CARDS_TABLE)
      .select('*')
      .eq('list_id', listId)
      .order('position');

    return lists.data || [];
  }

  async updateCard(card: any) {
    return await this.supabase
      .from(CARDS_TABLE)
      .update(card)
      .match({ id: card.id });
  }

  async deleteCard(card: any) {
    return await this.supabase
      .from(CARDS_TABLE)
      .delete()
      .match({ id: card.id });
  }


    // Invite others
    async addUserToBoard(boardId: string, email: string) {
      const user = await this.supabase
        .from(USERS_TABLE)
        .select('id')
        .match({ email })
        .single();
      console.log('the user to add: ', user);

      if (user.data?.id) {
        const userId = user.data.id;
        const userBoard = await this.supabase.from(USER_BOARDS_TABLE).insert({
          user_id: userId,
          board_id: boardId,
        });
        return userBoard;
      } else {
        return null;
      }
    }
  

    

}
