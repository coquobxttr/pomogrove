use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::json;
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

#[derive(Serialize, Deserialize, Debug)]
struct GridObjects {
    block_type: String,
    unlock_date: DateTime<Utc>,
    pomodoro_time: i32,
    x: i32,
    z: i32,
}

#[derive(Serialize, Deserialize, Debug)]
struct UserData {
    xp: i32,
    blocks: Vec<GridObjects>,
}

#[tauri::command]
fn invoke_user_data(app: AppHandle, data: UserData) -> String {
    //auto save user data to json
    let store = app.store("userData.json").expect("Failed to get store");

    store.set("user_data", json!(data));

    let _ = store.save();

    return "Function works".to_string();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .setup(|app| {
            //creating/loading an existing store

            let _ = app.store("userData.json")?;

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![invoke_user_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
