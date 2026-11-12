//! The live scene on kylet.se's home page: glowing metal shapes orbiting an
//! ember core, turning toward the pointer. It is keelengine.dev's hero scene,
//! so its poster (`site/assets/scenes/hero.webp`, a `keel shot` capture from
//! that site) shows exactly what starts. The same scene runs in the page
//! (`keel_mount`, WebGPU or WebGL2) and natively under `keel shot`.

use keel::prelude::*;
use keel::random::Rng;
use keel::render::{unit_cube, unit_sphere, Bloom, MeshGpuData, PostSettings, Tonemapping};

/// Every scene the site embeds, by id.
pub fn scenes() -> keel::app::Scenes {
    keel::app::Scenes::new().scene("hero", || world(hero))
}

/// How the scenes launch.
pub fn spec(name: &str) -> keel::app::LaunchSpec {
    keel::app::LaunchSpec::new(name)
}

/// The page calls this for each engine view: `mount` is the element id.
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen::prelude::wasm_bindgen]
pub fn keel_mount(mount: &str, scene: &str) -> std::result::Result<(), wasm_bindgen::JsValue> {
    console_error_panic_hook::set_once();
    spec(scene)
        .with_config(keel::app::AppConfig::new(scene).mount(mount))
        .run_scene(scenes(), scene)
        .map(|_| ())
        .map_err(|e| e.to_string().into())
}

/// A unit cube centred on its origin (the built-in one stands on it).
fn centered_cube() -> MeshGpuData {
    let mut cube = unit_cube();
    for vertex in &mut cube.vertices {
        vertex.position[1] -= 0.5;
    }
    cube
}

/// A transform at `translation` with `scale` and no rotation.
fn at(translation: Vec3, scale: Vec3) -> Transform3d {
    Transform3d { translation, rotation: Quat::IDENTITY, scale }
}

fn world(configure: fn(&mut WorldConfig)) -> Component {
    runtime(move |cx| World::create(cx, configure), |world| world.view(SceneView::new()))
}

/// The page background, so a scene edge meets the page without a seam.
pub const INK: Srgba = Srgba::rgb(0.027, 0.031, 0.043);

/// A camera with bloom and filmic tone mapping.
pub fn camera() -> Camera3d {
    Camera3d {
        clear_color: INK,
        post: PostSettings {
            tonemapping: Tonemapping::AgX,
            bloom: Some(Bloom {
                intensity: 0.35,
                threshold: 0.9,
                ..Bloom::default()
            }),
            ..PostSettings::default()
        },
        ..Camera3d::default()
    }
}

/// Where the pointer is over the scene: 0..1 across and down, (0.5, 0.5) at rest.
#[derive(Clone, Copy, Debug)]
pub struct Pointer {
    pub u: f32,
    pub v: f32,
    pub pressed: bool,
}

impl Default for Pointer {
    fn default() -> Self {
        Self { u: 0.5, v: 0.5, pressed: false }
    }
}

/// Fold this frame's pointer intents into the [`Pointer`] resource.
pub fn track_pointer(world: &mut EcsWorld) {
    let mut pointer = world.resource::<Pointer>().copied().unwrap_or_default();
    pointer.pressed = false;
    for intent in world.drain_intents() {
        let at = |key: &str| intent.payload[key].as_f64().unwrap_or(0.5) as f32;
        match intent.action.as_str() {
            "pointer.move" => (pointer.u, pointer.v) = (at("u"), at("v")),
            "pointer.down" => {
                (pointer.u, pointer.v) = (at("u"), at("v"));
                pointer.pressed = true;
            }
            _ => {}
        }
    }
    world.insert_resource(pointer);
}

fn emissive(assets: &AssetServer, color: LinearRgba, strength: f32) -> Handle<Material> {
    assets.add(Material {
        base_color: color,
        emissive: color,
        emissive_strength: strength,
        ..Material::default()
    })
}

fn metal(assets: &AssetServer, color: LinearRgba, roughness: f32) -> Handle<Material> {
    assets.add(Material {
        base_color: color,
        metallic: 1.0,
        roughness,
        ..Material::default()
    })
}

// ---------------------------------------------------------------- hero

/// A shape orbiting the core of the hero scene.
struct Orbit {
    radius: f32,
    speed: f32,
    phase: f32,
    lift: f32,
    spin: Vec3,
}

/// The camera sits left of the cluster, so the cluster fills the right of the
/// frame and the headline on the left stays readable.
const HERO_EYE: Vec3 = Vec3::new(-4.2, 1.2, 9.0);
const HERO_FOCUS: Vec3 = Vec3::new(-4.2, 0.0, 0.0);

fn hero(world: &mut WorldConfig) {
    world
        .profile(GameProfile::Playable3d)
        .insert_resource(AmbientLight { brightness: 0.14 })
        .insert_resource(Pointer::default());
    let Some(assets) = world.resource::<AssetServer>().cloned() else { return };
    world.spawn_bundle((camera(), Transform3d::look_at(HERO_EYE, HERO_FOCUS, Vec3::Y)));
    world.spawn_bundle((
        DirectionalLight { intensity: 2.2, ..DirectionalLight::default() },
        Transform3d::look_at(Vec3::new(-4.0, 6.0, 5.0), Vec3::ZERO, Vec3::Y),
    ));
    // A cool rim light from behind, so dark metal reads against the black.
    world.spawn_bundle((
        DirectionalLight { color: LinearRgba::rgb(0.45, 0.75, 1.0), intensity: 1.2, ..DirectionalLight::default() },
        Transform3d::look_at(Vec3::new(3.0, 2.0, -6.0), Vec3::ZERO, Vec3::Y),
    ));
    world.spawn_bundle((
        PointLight { color: LinearRgba::rgb(1.0, 0.45, 0.18), intensity: 40.0, range: 14.0, shadows: false },
        Transform3d::from_xyz(0.0, 0.0, 0.0),
    ));
    let core = emissive(&assets, LinearRgba::rgb(1.0, 0.38, 0.12), 3.0);
    let sphere = assets.add(unit_sphere(48, 24));
    world.spawn_bundle((Mesh3d(sphere.clone()), MeshMaterial3d(core), at(Vec3::ZERO, Vec3::splat(0.8))));
    let cube = assets.add(centered_cube());
    let dark = metal(&assets, LinearRgba::rgb(0.08, 0.09, 0.11), 0.28);
    let chrome = metal(&assets, LinearRgba::rgb(0.85, 0.86, 0.9), 0.12);
    let ion = emissive(&assets, LinearRgba::rgb(0.2, 0.75, 1.0), 4.0);
    let ember = emissive(&assets, LinearRgba::rgb(1.0, 0.45, 0.15), 3.5);
    let mut rng = Rng::new(7);
    for i in 0..140 {
        let material = match i % 14 {
            0 => ion.clone(),
            1 | 2 => ember.clone(),
            3..=5 => chrome.clone(),
            _ => dark.clone(),
        };
        let mesh = if i % 3 == 0 { sphere.clone() } else { cube.clone() };
        let scale = 0.08 + rng.next_f32().powi(3) * 0.45;
        world.spawn_bundle((
            Mesh3d(mesh),
            MeshMaterial3d(material),
            at(Vec3::ZERO, Vec3::splat(scale)),
            Orbit {
                radius: 1.8 + rng.next_f32() * 4.2,
                speed: (0.05 + rng.next_f32() * 0.2) * if i % 2 == 0 { 1.0 } else { -1.0 },
                phase: rng.next_f32() * std::f32::consts::TAU,
                lift: (rng.next_f32() - 0.5) * 3.2,
                spin: Vec3::new(rng.next_f32(), rng.next_f32(), rng.next_f32()) * 1.4,
            },
        ));
    }
    world
        .input(|w, _| track_pointer(w))
        .fixed(|w, dt| {
            let t = w.tick() as f32 * dt as f32;
            let pointer = w.resource::<Pointer>().copied().unwrap_or_default();
            let mut orbits = w.query::<(&mut Transform3d, &Orbit)>();
            orbits.for_each(w, |(mut transform, orbit)| {
                let a = orbit.phase + t * orbit.speed;
                transform.translation = Vec3::new(a.cos() * orbit.radius, orbit.lift + (t * 0.6 + orbit.phase).sin() * 0.25, a.sin() * orbit.radius);
                transform.rotation *= Quat::from_scaled_axis(orbit.spin * dt as f32);
            });
            // The camera leans toward the pointer.
            let target = HERO_EYE + Vec3::new((pointer.u - 0.5) * 5.0, -(pointer.v - 0.5) * 3.0, 0.0);
            let mut cameras = w.query::<(&mut Transform3d, &Camera3d)>();
            cameras.for_each(w, |(mut transform, _)| {
                let eased = transform.translation.lerp(target, 1.0 - (-3.0 * dt as f32).exp());
                *transform = Transform3d::look_at(eased, HERO_FOCUS, Vec3::Y);
            });
        });
}
