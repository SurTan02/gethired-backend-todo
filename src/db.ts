import { Pool, createPool } from "mysql2";

let pool: Pool;

// koneksi ke database
export const init = () => {
    try {
      pool = createPool({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'user',
        database: process.env.MYSQL_DBNAME || 'skyshi',
        password: process.env.MYSQL_PASSWORD || 'root',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
  
      console.debug("Database connected!");
    } catch (error) {
      console.error("[Error]: ", error);
      throw new Error("Fail to connect database!");
    }
  };

export const execute = <T>(
    query: string,
    params: string[] | Object
  ): Promise<T> => {
    try {
      if (!pool)
        throw new Error(
          "Database Error"
        );
  
      return new Promise<T>((resolve, reject) => {
        pool.query(query, params, (error, results) => {
          if (error) reject(error);
          //@ts-ignore
          else resolve(results);
        });
      });
    } catch (error) {
      console.error("[Error]: ", error);
      throw error;
    }
};

// migrasi database
export const migration = async() => {
    try {
         // query mysql untuk membuat table contacts
        await execute(
            `
            CREATE TABLE IF NOT EXISTS activities (
                activity_id int not null auto_increment,
                title varchar(255) not null,
                email varchar(255) not null,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP ,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                primary key (activity_id)
            )
        `
        , []);

        await execute(
            `
            CREATE TABLE IF NOT EXISTS todos (
                todo_id int not null auto_increment,
                activity_group_id int not null,
                title varchar(255) not null,
                priority varchar(255)  DEFAULT 'very-high',
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP ,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (todo_id),
                FOREIGN KEY (activity_group_id) REFERENCES activities(activity_id) ON DELETE CASCADE
            )
        `
        , []);
        console.log('Running Migration Successfully!');
    } catch (err) {
        throw err;
    }
};