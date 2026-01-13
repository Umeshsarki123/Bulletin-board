use yew::prelude::*;
use gloo_net::http::Request;
use serde::Deserialize;

#[derive(Deserialize, Clone, PartialEq)]
struct Note {
    id: u64,
    title: String,
    description: String,
}

#[function_component(App)]
fn app() -> Html {
    let notes = use_state(|| Vec::<Note>::new());
    let error = use_state(|| None::<String>);

    {
        let notes = notes.clone();
        let error = error.clone();

        use_effect_with((), move |_| {
            wasm_bindgen_futures::spawn_local(async move {
                match Request::get("http://localhost:3000/notes")
                    .send()
                    .await
                {
                    Ok(resp) => {
                        if let Ok(data) = resp.json::<Vec<Note>>().await {
                            notes.set(data);
                        } else {
                            error.set(Some("Invalid JSON from backend".into()));
                        }
                    }
                    Err(_) => {
                        error.set(Some("Cannot connect to backend".into()));
                    }
                }
            });

            || ()
        });
    }

    
    let colors = vec![
        "#f8b195", // soft pink
        "#c06c84", // mauve
        "#6c5b7b", // purple
        "#355c7d", // blue
        "#f67280", // coral
        "#99b898", // green
    ];

    html! {
       
        <div style="
            padding: 20px;
            background-color: #270b0bff; 
            min-height: 100vh; 
        ">
            <h1 style="
                padding: 5px;
               background: linear-gradient(200deg, #eee7e7, #e29609ff, #5a0d0dff);
                text-align: center;
                border-radius: 10px;
                ">
                { "Bulletin Board" }
                </h1>


            if let Some(err) = &*error {
                <p style="color: red;">{ err }</p>
            }

           
            <div style="
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
            ">
                { for notes.iter().enumerate().map(|(i, note)| {
                    let color = colors[i % colors.len()]; // cycle through colors

                    html! {
                        <div key={note.id} style={format!("
                            background: {};
                            border: 1px solid #ddd;
                            border-radius: 8px;
                            padding: 15px;
                            width: 200px;
                            box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
                            display: flex;
                            flex-direction: column;
                        ", color)}>


                            <strong style="margin-bottom: 8px;">{ &note.title }</strong>
                            <p style="flex-grow: 1;">{ &note.description }</p>
                        </div>
                    }
                })}
            </div>
        </div>
    }
}

fn main() {
    yew::Renderer::<App>::new().render();
}
