import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DegreePlannerComponent } from "./degree-planner.component";

describe("DegreePlannerComponent", () => {
  let component: DegreePlannerComponent;
  let fixture: ComponentFixture<DegreePlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DegreePlannerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DegreePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
