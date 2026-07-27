# Point Cloud Registration and Trajectory Correction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a Chinese technical article that explains ICP, CPD, common point-cloud registration alternatives, and a reproducible industrial workpiece trajectory-correction experiment.

**Architecture:** Add one Hexo Markdown post organized around a source-to-target coordinate convention. The article first builds the mathematical and engineering model, then provides two self-contained Python experiments: Open3D rigid registration with trajectory pose correction, and pycpd non-rigid registration for contrast. Verification extracts the Python blocks, checks their syntax, runs them when dependencies are available, and builds the Hexo site.

**Tech Stack:** Hexo 5, Markdown, Mermaid, Python 3, NumPy, Open3D, Matplotlib, pycpd

---

## File Structure

- Create `source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md`: complete article, equations, diagrams, runnable Python examples, engineering checklist, and project extension.
- Create `docs/superpowers/plans/2026-07-27-point-cloud-registration-trajectory-correction.md`: this implementation plan.
- Do not modify existing posts, themes, site configuration, or package manifests.

### Task 1: Create the Article Frame and Problem Model

**Files:**
- Create: `source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md`

- [ ] **Step 1: Add valid front matter and graph links**

Use the title `从调用 ICP 接口到理解点云配准：CPD、常用算法与工件轨迹纠偏`, date `2026-07-27 00:00:00`, tags `点云`, `ICP`, `CPD`, `Open3D`, `工业视觉`, and category `机器人`. Relate the post to `MachineVision`, `MedicalImageFormat`, and `Kinematics` through the repository's `graph-links` comment format.

- [ ] **Step 2: Write the experience-based introduction without overstating evidence**

State that the author has called ICP APIs in iOS oral Mesh comparison and encountered point-cloud trajectory correction in industrial work, but has not developed the underlying algorithms. Define the article's learning goal as explaining, reproducing, evaluating, and safely consuming registration results.

- [ ] **Step 3: Define the common data model**

Explain Mesh versus point cloud versus trajectory pose; rigid versus affine versus non-rigid registration; source, target, correspondence, overlap, outlier, and initial pose. Use a comparison table for the oral-treatment and workpiece scenarios.

- [ ] **Step 4: Fix one transform convention for the entire article**

Use column vectors and left multiplication:

```text
p_target = T_target_source * p_source
T_actual_tcp = T_actual_reference * T_reference_tcp
```

Explain that points use rotation and translation, while vectors and normals use only rotation. Include a short numerical direction check showing that a known source point must land on its corresponding target point.

- [ ] **Step 5: Validate the article shell**

Run:

```bash
npx hexo generate
```

Expected: the command exits with code 0 and generates a page for `Point-Cloud-Registration-ICP-CPD-Trajectory-Correction`.

- [ ] **Step 6: Commit the article frame**

```bash
git add source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md
git commit -m "content: introduce point cloud registration model"
```

### Task 2: Explain ICP from Mathematics to Engineering

**Files:**
- Modify: `source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md`

- [ ] **Step 1: Add the ICP data-flow diagram**

Use a Mermaid flowchart with these nodes and branches: input source/target, preprocess, initial transform, nearest-neighbor correspondence, reject bad pairs, estimate incremental transform, update source, evaluate stop condition, output transform, and retry/reject on failed quality gates.

- [ ] **Step 2: Explain point-to-point ICP**

Give the objective

```text
min(R,t) sum_i ||q_i - (R p_i + t)||^2
```

and explain nearest-neighbor correspondence, centroid removal, cross-covariance, SVD, reflection correction, transformation update, and convergence. Clearly distinguish the closed-form pose update from the outer ICP iteration.

- [ ] **Step 3: Explain point-to-plane and practical variants**

Give the objective

```text
min(R,t) sum_i ((q_i - (R p_i + t)) dot n_i)^2
```

Compare point-to-point, point-to-plane, trimmed/robust ICP, colored ICP, and GICP by required data, advantage, and failure mode.

- [ ] **Step 4: Explain preprocessing and initial alignment**

Cover unit checks, finite-value removal, ROI cropping, voxel downsampling, statistical/radius outlier removal, normal estimation, and multi-scale refinement. Explain initial-pose sources: fixture/CAD prior, markers, picked points, FPFH + RANSAC, FGR, TEASER++, and 4PCS/Super4PCS.

- [ ] **Step 5: Add failure diagnosis**

Use concrete examples for local minima, repeated/symmetric geometry, insufficient overlap, wrong scale/unit, moving objects, density imbalance, bad normals, and scans that do not cover the surface near the trajectory. State why `converged`, high fitness, or low inlier RMSE alone cannot prove correctness.

- [ ] **Step 6: Commit the ICP explanation**

```bash
git add source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md
git commit -m "content: explain ICP and registration failure modes"
```

### Task 3: Add the Reproducible Open3D Rigid Experiment

**Files:**
- Modify: `source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md`

- [ ] **Step 1: Add setup and deterministic data generation**

The code block must import `copy`, `numpy as np`, and `open3d as o3d`, set both NumPy and Open3D random seeds, and define these functions with transformation direction in their names or docstrings:

```python
def make_asymmetric_workpiece() -> o3d.geometry.PointCloud: ...
def make_transform(rotation_xyz_deg, translation_xyz) -> np.ndarray: ...
def transform_points(points: np.ndarray, transform_target_source: np.ndarray) -> np.ndarray: ...
def corrupt_actual_scan(clean_points: np.ndarray) -> o3d.geometry.PointCloud: ...
```

The workpiece must combine unequal boxes and a cylinder so that the geometry is not perfectly symmetric. Apply a known `T_actual_reference`, Gaussian noise, a partial crop, and uniformly distributed outliers.

- [ ] **Step 2: Add preprocessing and coarse registration**

Define:

```python
def preprocess(pcd, voxel_size):
    down = pcd.voxel_down_sample(voxel_size)
    down.estimate_normals(...)
    fpfh = o3d.pipelines.registration.compute_fpfh_feature(...)
    return down, fpfh

def global_registration(reference_down, actual_down, reference_fpfh, actual_fpfh, voxel_size):
    return o3d.pipelines.registration.registration_ransac_based_on_feature_matching(...)
```

Use mutual filtering, edge-length and distance correspondence checkers, point-to-point estimation without scaling, explicit convergence criteria, and comments explaining why the RANSAC output is only an initial pose.

- [ ] **Step 3: Add ICP refinement and pose-error metrics**

Define point-to-plane ICP using the coarse transformation, and add:

```python
def rotation_error_deg(estimated_rotation, true_rotation) -> float:
    delta = estimated_rotation @ true_rotation.T
    cosine = np.clip((np.trace(delta) - 1.0) / 2.0, -1.0, 1.0)
    return float(np.degrees(np.arccos(cosine)))

def translation_error(estimated_transform, true_transform) -> float:
    return float(np.linalg.norm(estimated_transform[:3, 3] - true_transform[:3, 3]))
```

Print the true and estimated source-to-target transforms, fitness, inlier RMSE, rotation error in degrees, and translation error in the model's length unit.

- [ ] **Step 4: Add trajectory pose correction**

Represent each reference TCP pose as a 4x4 matrix and define:

```python
def correct_trajectory(reference_tcp_poses, transform_actual_reference):
    return [transform_actual_reference @ pose for pose in reference_tcp_poses]
```

Compare corrected poses with poses transformed by the ground-truth matrix. Explain why adding the translation vector to XYZ alone gives a wrong tool orientation, and why inverse-transform confusion can produce plausible-looking but dangerous output.

- [ ] **Step 5: Add result interpretation and a deliberate failure experiment**

Tell the reader to replace the coarse result with identity or reduce overlap, rerun ICP, and compare the transform error rather than only the rendered overlap. Record expected behavior qualitatively because Open3D versions and CPU scheduling can change exact RANSAC results.

- [ ] **Step 6: Extract and syntax-check the rigid code block**

Mark the block with HTML comments `rigid-demo:start` and `rigid-demo:end`, extract its contents to `/tmp/point_cloud_rigid_demo.py`, then run:

```bash
python3 -m py_compile /tmp/point_cloud_rigid_demo.py
```

Expected: exit code 0 and no output.

- [ ] **Step 7: Run the rigid experiment when Open3D is available**

Run:

```bash
python3 /tmp/point_cloud_rigid_demo.py
```

Expected: exit code 0; finite fitness/RMSE values; estimated transform shape `(4, 4)`; translation and rotation errors printed. If `open3d` is unavailable, record the dependency gap and do not claim runtime verification.

- [ ] **Step 8: Commit the rigid experiment**

```bash
git add source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md
git commit -m "content: add Open3D trajectory correction experiment"
```

### Task 4: Explain CPD and Add the Non-Rigid Contrast Experiment

**Files:**
- Modify: `source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md`

- [ ] **Step 1: Explain CPD's probability model**

Describe the target points as observations and the moving points as Gaussian-mixture centroids, then explain the E-step as soft correspondence and the M-step as transformation/variance update. Compare rigid, affine, and deformable CPD, and state that deformable CPD produces a spatial deformation field rather than one `SE(3)` pose.

- [ ] **Step 2: Compare ICP and CPD without declaring a universal winner**

Use a table covering correspondence, transform model, initial-pose sensitivity, outlier handling, computation cost, typical application, and whether a single rigid trajectory-correction matrix is produced.

- [ ] **Step 3: Add a deterministic pycpd experiment**

Mark the block with `cpd-demo:start` and `cpd-demo:end`. Use NumPy to create a U-shaped or dental-arch-like 2D point set, deform part of it smoothly, add small noise, and run:

```python
from pycpd import DeformableRegistration

registration = DeformableRegistration(
    X=target_points,
    Y=moving_points,
    alpha=2.0,
    beta=1.5,
)
registered_points, _ = registration.register()
```

Plot moving, target, and registered points with equal axes. Explain that this visualization demonstrates smooth correspondence but cannot be converted into one workpiece pose matrix.

- [ ] **Step 4: Syntax-check and optionally run the CPD experiment**

Extract the block to `/tmp/point_cloud_cpd_demo.py`, then run:

```bash
python3 -m py_compile /tmp/point_cloud_cpd_demo.py
python3 /tmp/point_cloud_cpd_demo.py
```

Expected: syntax check exits 0. Runtime exits 0 and writes `/tmp/cpd_registration.png` when `numpy`, `matplotlib`, and `pycpd` are installed. Otherwise record the exact missing dependency.

- [ ] **Step 5: Commit the CPD section**

```bash
git add source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md
git commit -m "content: compare CPD with rigid registration"
```

### Task 5: Add the Algorithm Map, Production Gates, and Learning Deliverable

**Files:**
- Modify: `source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md`

- [ ] **Step 1: Add a scenario-based algorithm map**

Briefly position ICP, GICP, NDT, FPFH + RANSAC, FGR, TEASER++, 4PCS/Super4PCS, Go-ICP, CPD, and learning-based descriptors. For each, state whether it is mainly coarse/fine, rigid/non-rigid, its main advantage, and its principal constraint. Avoid implying that all algorithms are interchangeable or equally common in every industry.

- [ ] **Step 2: Add the end-to-end industrial data flow**

Use a Mermaid flowchart:

```text
reference CAD/scan + reference trajectory
-> actual scan
-> preprocessing
-> coarse registration
-> fine registration
-> independent validation
-> trajectory pose transformation
-> reachability/collision/process checks
-> human approval or controlled export
```

Include a rejection path from every validation stage; do not show direct automatic robot execution.

- [ ] **Step 3: Add quality gates and observability**

Separate algorithm metrics from process metrics. Cover fitness, inlier RMSE, independent landmark residuals, rotation/translation bounds, local coverage around the trajectory, normal-angle residuals, repeatability across scans, runtime, input/output hashes, parameter logging, transform direction, software version, and visualization snapshots.

- [ ] **Step 4: Add a production-oriented pseudocode gate**

Use explicit rejection logic such as:

```python
if fitness < configured_min_fitness:
    reject("insufficient overlap")
if landmark_rmse_mm > configured_max_landmark_rmse_mm:
    reject("independent validation failed")
if not trajectory_surface_is_covered:
    reject("trajectory region was not observed")
if not passes_robot_checks(corrected_trajectory):
    reject("reachability, collision, or process constraint failed")
```

State that thresholds must come from scanner uncertainty, process tolerance, robot accuracy, and validation studies rather than this article's synthetic data.

- [ ] **Step 5: Add the portfolio extension**

Define the deliverable `点云配准与轨迹纠偏验证器`, acceptance criteria, interview value, and a staged learning path: reproduce synthetic data, replace it with public/real scans, add batch evaluation, add Web3D visualization, then integrate ROS2 or an offline robot simulator.

- [ ] **Step 6: Commit the engineering completion**

```bash
git add source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md
git commit -m "content: complete registration engineering guide"
```

### Task 6: Verify Terminology, Code, and Hexo Output

**Files:**
- Modify if needed: `source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md`

- [ ] **Step 1: Scan terminology and placeholders**

Run:

```bash
rg -n "CDP|TBD|待补|先占位|万能|绝对准确" source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md
```

Expected: no accidental `CDP`, placeholder, or unjustified certainty. A sentence explicitly correcting `CDP` to `CPD` is allowed only if intentional.

- [ ] **Step 2: Check Markdown whitespace and front matter**

Run:

```bash
git diff --check
npx hexo list post | rg "从调用 ICP 接口到理解点云配准"
```

Expected: `git diff --check` exits 0; Hexo lists the new post exactly once.

- [ ] **Step 3: Re-extract and verify both Python blocks**

Run `python3 -m py_compile` on `/tmp/point_cloud_rigid_demo.py` and `/tmp/point_cloud_cpd_demo.py`, then run each script if its imports are installed. Confirm that no code line depends on an omitted helper or notebook state.

- [ ] **Step 4: Build the complete site**

Run:

```bash
npm run build
```

Expected: exit code 0, no Hexo rendering error, and generated HTML contains the article title, `T_actual_reference`, `Open3D`, and `CPD`.

- [ ] **Step 5: Review the article against the approved design**

Confirm that all 13 content sections, both experiments, one deliberate failure exercise, the transform convention, position and orientation correction, safety boundaries, algorithm map, deliverable, acceptance criteria, and interview value are present. Remove duplicate explanations and qualify any claim that depends on data quality or library configuration.

- [ ] **Step 6: Commit verification fixes if any**

```bash
git add source/_posts/Point-Cloud-Registration-ICP-CPD-Trajectory-Correction.md
git commit -m "docs: verify point cloud registration guide"
```
