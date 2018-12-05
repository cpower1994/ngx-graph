import { NgModule } from '@angular/core';
import { GraphComponent } from './graph.component';
import { ChartCommonModule } from '@swimlane/ngx-charts';
import { MouseWheelDirective } from './mouse-wheel.directive';
import { LayoutService } from './layouts/layout.service';
import { MatCardModule } from '@angular/material/card';
export { GraphComponent };

@NgModule({
  imports: [ChartCommonModule,
            MatCardModule
           ],
  declarations: [GraphComponent, MouseWheelDirective],
  exports: [GraphComponent, MouseWheelDirective],
  providers: [LayoutService]
})
export class GraphModule {}
