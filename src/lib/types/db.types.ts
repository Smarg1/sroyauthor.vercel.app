export type Json =
  | boolean
  | Json[]
  | null
  | number
  | string
  | { [key: string]: Json | undefined };

export interface Database {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  api: {
    CompositeTypes: {
      blog_type: {
        content: null | string;
        created_at: null | string;
        description: null | string;
        id: null | string;
        slug: null | string;
        tags: null | string[];
        title: null | string;
        updated_at: null | string;
      };
      book_type: {
        created_at: null | string;
        description: null | string;
        id: null | string;
        image_url: null | string;
        isbn: null | string;
        slug: null | string;
        title: null | string;
        updated_at: null | string;
      };
      contribution_type: {
        created_at: null | string;
        description: null | string;
        id: null | string;
        image_url: null | string;
        slug: null | string;
        title: null | string;
        updated_at: null | string;
      };
      metadata_type: {
        key: null | string;
        value: null | string;
      };
    };
    Enums: {
      work: 'blogs' | 'books' | 'contributions';
    };
    Functions: Record<never, never>;
    Tables: {
      blogs: {
        Insert: {
          content: string;
          image?: null | string;
          slug: string;
          tags?: null | string[];
        };
        Relationships: [
          {
            columns: ['slug'];
            foreignKeyName: 'blogs_slug_fkey';
            isOneToOne: true;
            referencedColumns: ['slug'];
            referencedRelation: 'content_nodes';
          },
        ];
        Row: {
          content: string;
          image: null | string;
          slug: string;
          tags: null | string[];
        };
        Update: {
          content?: string;
          image?: null | string;
          slug?: string;
          tags?: null | string[];
        };
      };
      books: {
        Insert: {
          image?: string;
          isbn: string;
          slug: string;
        };
        Relationships: [
          {
            columns: ['slug'];
            foreignKeyName: 'books_slug_fkey';
            isOneToOne: true;
            referencedColumns: ['slug'];
            referencedRelation: 'content_nodes';
          },
        ];
        Row: {
          image: string;
          isbn: string;
          slug: string;
        };
        Update: {
          image?: string;
          isbn?: string;
          slug?: string;
        };
      };
      content_nodes: {
        Insert: {
          created_at?: string;
          description?: string;
          slug?: string;
          title: string;
          type: Database['api']['Enums']['work'];
        };
        Relationships: [];
        Row: {
          created_at: string;
          description: string;
          slug: string;
          title: string;
          type: Database['api']['Enums']['work'];
        };
        Update: {
          created_at?: string;
          description?: string;
          slug?: string;
          title?: string;
          type?: Database['api']['Enums']['work'];
        };
      };
      contributions: {
        Insert: {
          image?: string;
          slug: string;
        };
        Relationships: [
          {
            columns: ['slug'];
            foreignKeyName: 'contributions_slug_fkey';
            isOneToOne: true;
            referencedColumns: ['slug'];
            referencedRelation: 'content_nodes';
          },
        ];
        Row: {
          image: string;
          slug: string;
        };
        Update: {
          image?: string;
          slug?: string;
        };
      };
      events: {
        Insert: {
          description?: string;
          expiry: string;
          image?: string;
          Title?: string;
        };
        Relationships: [];
        Row: {
          description: string;
          expiry: string;
          image: string;
          Title: string;
        };
        Update: {
          description?: string;
          expiry?: string;
          image?: string;
          Title?: string;
        };
      };
      metadata: {
        Insert: {
          key: string;
          value?: null | string;
        };
        Relationships: [];
        Row: {
          key: string;
          value: null | string;
        };
        Update: {
          key?: string;
          value?: null | string;
        };
      };
    };
    Views: Record<never, never>;
  };
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  api: {
    Enums: {
      work: ['books', 'contributions', 'blogs'],
    },
  },
} as const;
